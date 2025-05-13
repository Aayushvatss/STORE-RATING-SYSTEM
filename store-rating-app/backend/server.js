const express = require("express")
const cors = require("cors")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const mysql = require("mysql2/promise")
const dotenv = require("dotenv")

// Load environment variables
dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

// Middleware
app.use(cors())
app.use(express.json())

// Database connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "store_rating_system",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
})

// JWT Secret
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"

// Middleware to verify JWT token
const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers["authorization"]
  const token = authHeader && authHeader.split(" ")[1]

  if (!token) {
    return res.status(401).json({ message: "Access denied. No token provided." })
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET)

    // Get user from database to ensure they still exist and have the correct role
    const [users] = await pool.query("SELECT id, name, email, role FROM users WHERE id = ?", [decoded.userId])

    if (users.length === 0) {
      return res.status(401).json({ message: "Invalid token. User not found." })
    }

    req.user = users[0]
    next()
  } catch (error) {
    return res.status(401).json({ message: "Invalid token." })
  }
}

// Middleware to check if user has admin role
const isAdmin = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Access denied. Admin role required." })
  }
  next()
}

// Middleware to check if user has store owner role
const isStoreOwner = (req, res, next) => {
  if (req.user.role !== "store") {
    return res.status(403).json({ message: "Access denied. Store owner role required." })
  }
  next()
}

// Middleware to check if user has normal user role
const isUser = (req, res, next) => {
  if (req.user.role !== "user") {
    return res.status(403).json({ message: "Access denied. User role required." })
  }
  next()
}

// Auth Routes
app.post("/api/auth/register", async (req, res) => {
  try {
    const { name, email, password, address } = req.body

    // Validate input
    if (!name || !email || !password || !address) {
      return res.status(400).json({ message: "All fields are required" })
    }

    // Validate name length
    if (name.length < 20 || name.length > 60) {
      return res.status(400).json({ message: "Name must be between 20 and 60 characters" })
    }

    // Validate address length
    if (address.length > 400) {
      return res.status(400).json({ message: "Address must not exceed 400 characters" })
    }

    // Validate password
    const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,16}$/
    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        message: "Password must be 8-16 characters with at least one uppercase letter and one special character",
      })
    }

    // Check if email already exists
    const [existingUsers] = await pool.query("SELECT * FROM users WHERE email = ?", [email])

    if (existingUsers.length > 0) {
      return res.status(400).json({ message: "Email already in use" })
    }

    // Hash password
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    // Insert user
    const [result] = await pool.query(
      "INSERT INTO users (name, email, password, address, role) VALUES (?, ?, ?, ?, ?)",
      [name, email, hashedPassword, address, "user"],
    )

    res.status(201).json({ message: "User registered successfully" })
  } catch (error) {
    console.error("Registration error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" })
    }

    // Check if user exists
    const [users] = await pool.query("SELECT * FROM users WHERE email = ?", [email])

    if (users.length === 0) {
      return res.status(401).json({ message: "Invalid email or password" })
    }

    const user = users[0]

    // Check password
    const validPassword = await bcrypt.compare(password, user.password)
    if (!validPassword) {
      return res.status(401).json({ message: "Invalid email or password" })
    }

    // Create and sign JWT
    const token = jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET, { expiresIn: "24h" })

    // Return user info and token
    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    })
  } catch (error) {
    console.error("Login error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

app.get("/api/auth/me", authenticateToken, (req, res) => {
  res.json(req.user)
})

app.put("/api/auth/change-password", authenticateToken, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body

    // Validate input
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: "Current password and new password are required" })
    }

    // Validate new password
    const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,16}$/
    if (!passwordRegex.test(newPassword)) {
      return res.status(400).json({
        message: "Password must be 8-16 characters with at least one uppercase letter and one special character",
      })
    }

    // Get user with password
    const [users] = await pool.query("SELECT * FROM users WHERE id = ?", [req.user.id])

    if (users.length === 0) {
      return res.status(404).json({ message: "User not found" })
    }

    const user = users[0]

    // Verify current password
    const validPassword = await bcrypt.compare(currentPassword, user.password)
    if (!validPassword) {
      return res.status(401).json({ message: "Current password is incorrect" })
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(newPassword, salt)

    // Update password
    await pool.query("UPDATE users SET password = ? WHERE id = ?", [hashedPassword, req.user.id])

    res.json({ message: "Password updated successfully" })
  } catch (error) {
    console.error("Change password error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// Admin Routes
app.get("/api/admin/dashboard-stats", authenticateToken, isAdmin, async (req, res) => {
  try {
    // Get total users
    const [userResult] = await pool.query("SELECT COUNT(*) as count FROM users")
    const totalUsers = userResult[0].count

    // Get total stores
    const [storeResult] = await pool.query('SELECT COUNT(*) as count FROM users WHERE role = "store"')
    const totalStores = storeResult[0].count

    // Get total ratings
    const [ratingResult] = await pool.query("SELECT COUNT(*) as count FROM ratings")
    const totalRatings = ratingResult[0].count

    res.json({
      totalUsers,
      totalStores,
      totalRatings,
    })
  } catch (error) {
    console.error("Dashboard stats error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

app.get("/api/admin/stores", authenticateToken, isAdmin, async (req, res) => {
  try {
    const { sortField = "name", sortDirection = "asc", name, email, address } = req.query

    // Validate sort field
    const allowedSortFields = ["name", "email", "address", "rating"]
    const validSortField = allowedSortFields.includes(sortField) ? sortField : "name"

    // Validate sort direction
    const validSortDirection = sortDirection === "desc" ? "DESC" : "ASC"

    // Build query with filters
    let query = `
      SELECT u.id, u.name, u.email, u.address, 
      (SELECT AVG(rating) FROM ratings WHERE store_id = u.id) as rating
      FROM users u
      WHERE u.role = 'store'
    `

    const queryParams = []

    if (name) {
      query += " AND u.name LIKE ?"
      queryParams.push(`%${name}%`)
    }

    if (email) {
      query += " AND u.email LIKE ?"
      queryParams.push(`%${email}%`)
    }

    if (address) {
      query += " AND u.address LIKE ?"
      queryParams.push(`%${address}%`)
    }

    // Add sorting
    if (validSortField === "rating") {
      query += ` ORDER BY rating ${validSortDirection}`
    } else {
      query += ` ORDER BY u.${validSortField} ${validSortDirection}`
    }

    const [stores] = await pool.query(query, queryParams)

    res.json(stores)
  } catch (error) {
    console.error("Get stores error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

app.post("/api/admin/stores", authenticateToken, isAdmin, async (req, res) => {
  try {
    const { name, email, password, address } = req.body

    // Validate input
    if (!name || !email || !password || !address) {
      return res.status(400).json({ message: "All fields are required" })
    }

    // Validate name length
    if (name.length < 20 || name.length > 60) {
      return res.status(400).json({ message: "Name must be between 20 and 60 characters" })
    }

    // Validate address length
    if (address.length > 400) {
      return res.status(400).json({ message: "Address must not exceed 400 characters" })
    }

    // Validate password
    const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,16}$/
    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        message: "Password must be 8-16 characters with at least one uppercase letter and one special character",
      })
    }

    // Check if email already exists
    const [existingUsers] = await pool.query("SELECT * FROM users WHERE email = ?", [email])

    if (existingUsers.length > 0) {
      return res.status(400).json({ message: "Email already in use" })
    }

    // Hash password
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    // Insert store
    const [result] = await pool.query(
      "INSERT INTO users (name, email, password, address, role) VALUES (?, ?, ?, ?, ?)",
      [name, email, hashedPassword, address, "store"],
    )

    res.status(201).json({ message: "Store added successfully", id: result.insertId })
  } catch (error) {
    console.error("Add store error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

app.get("/api/admin/users", authenticateToken, isAdmin, async (req, res) => {
  try {
    const { sortField = "name", sortDirection = "asc", name, email, address, role } = req.query

    // Validate sort field
    const allowedSortFields = ["name", "email", "address", "role"]
    const validSortField = allowedSortFields.includes(sortField) ? sortField : "name"

    // Validate sort direction
    const validSortDirection = sortDirection === "desc" ? "DESC" : "ASC"

    // Build query with filters
    let query = `
      SELECT u.id, u.name, u.email, u.address, u.role,
      (SELECT AVG(rating) FROM ratings WHERE store_id = u.id) as rating
      FROM users u
      WHERE 1=1
    `

    const queryParams = []

    if (name) {
      query += " AND u.name LIKE ?"
      queryParams.push(`%${name}%`)
    }

    if (email) {
      query += " AND u.email LIKE ?"
      queryParams.push(`%${email}%`)
    }

    if (address) {
      query += " AND u.address LIKE ?"
      queryParams.push(`%${address}%`)
    }

    if (role) {
      query += " AND u.role = ?"
      queryParams.push(role)
    }

    // Add sorting
    query += ` ORDER BY u.${validSortField} ${validSortDirection}`

    const [users] = await pool.query(query, queryParams)

    res.json(users)
  } catch (error) {
    console.error("Get users error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

app.post("/api/admin/users", authenticateToken, isAdmin, async (req, res) => {
  try {
    const { name, email, password, address, role } = req.body

    // Validate input
    if (!name || !email || !password || !address || !role) {
      return res.status(400).json({ message: "All fields are required" })
    }

    // Validate role
    const validRoles = ["admin", "user", "store"]
    if (!validRoles.includes(role)) {
      return res.status(400).json({ message: "Invalid role" })
    }

    // Validate name length
    if (name.length < 20 || name.length > 60) {
      return res.status(400).json({ message: "Name must be between 20 and 60 characters" })
    }

    // Validate address length
    if (address.length > 400) {
      return res.status(400).json({ message: "Address must not exceed 400 characters" })
    }

    // Validate password
    const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,16}$/
    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        message: "Password must be 8-16 characters with at least one uppercase letter and one special character",
      })
    }

    // Check if email already exists
    const [existingUsers] = await pool.query("SELECT * FROM users WHERE email = ?", [email])

    if (existingUsers.length > 0) {
      return res.status(400).json({ message: "Email already in use" })
    }

    // Hash password
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    // Insert user
    const [result] = await pool.query(
      "INSERT INTO users (name, email, password, address, role) VALUES (?, ?, ?, ?, ?)",
      [name, email, hashedPassword, address, role],
    )

    res.status(201).json({ message: "User added successfully", id: result.insertId })
  } catch (error) {
    console.error("Add user error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// User Routes
app.get("/api/user/stores", authenticateToken, isUser, async (req, res) => {
  try {
    const { sortField = "name", sortDirection = "asc", name, address } = req.query

    // Validate sort field
    const allowedSortFields = ["name", "address", "rating"]
    const validSortField = allowedSortFields.includes(sortField) ? sortField : "name"

    // Validate sort direction
    const validSortDirection = sortDirection === "desc" ? "DESC" : "ASC"

    // Build query with filters
    let query = `
      SELECT u.id, u.name, u.address, 
      (SELECT AVG(rating) FROM ratings WHERE store_id = u.id) as rating,
      (SELECT rating FROM ratings WHERE store_id = u.id AND user_id = ?) as userRating
      FROM users u
      WHERE u.role = 'store'
    `

    const queryParams = [req.user.id]

    if (name) {
      query += " AND u.name LIKE ?"
      queryParams.push(`%${name}%`)
    }

    if (address) {
      query += " AND u.address LIKE ?"
      queryParams.push(`%${address}%`)
    }

    // Add sorting
    if (validSortField === "rating") {
      query += ` ORDER BY rating ${validSortDirection}`
    } else {
      query += ` ORDER BY u.${validSortField} ${validSortDirection}`
    }

    const [stores] = await pool.query(query, queryParams)

    res.json(stores)
  } catch (error) {
    console.error("Get stores error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

app.post("/api/user/ratings", authenticateToken, isUser, async (req, res) => {
  try {
    const { storeId, rating } = req.body

    // Validate input
    if (!storeId || !rating) {
      return res.status(400).json({ message: "Store ID and rating are required" })
    }

    // Validate rating range
    if (rating < 1 || rating > 5) {
      return res.status(400).json({ message: "Rating must be between 1 and 5" })
    }

    // Check if store exists and is a store
    const [stores] = await pool.query('SELECT * FROM users WHERE id = ? AND role = "store"', [storeId])

    if (stores.length === 0) {
      return res.status(404).json({ message: "Store not found" })
    }

    // Check if user has already rated this store
    const [existingRatings] = await pool.query("SELECT * FROM ratings WHERE user_id = ? AND store_id = ?", [
      req.user.id,
      storeId,
    ])

    if (existingRatings.length > 0) {
      // Update existing rating
      await pool.query("UPDATE ratings SET rating = ? WHERE user_id = ? AND store_id = ?", [
        rating,
        req.user.id,
        storeId,
      ])

      res.json({ message: "Rating updated successfully" })
    } else {
      // Insert new rating
      await pool.query("INSERT INTO ratings (user_id, store_id, rating) VALUES (?, ?, ?)", [
        req.user.id,
        storeId,
        rating,
      ])

      res.status(201).json({ message: "Rating submitted successfully" })
    }
  } catch (error) {
    console.error("Submit rating error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// Store Owner Routes
app.get("/api/store/dashboard", authenticateToken, isStoreOwner, async (req, res) => {
  try {
    // Get store information
    const [storeInfo] = await pool.query("SELECT name, address FROM users WHERE id = ?", [req.user.id])

    if (storeInfo.length === 0) {
      return res.status(404).json({ message: "Store not found" })
    }

    // Get average rating
    const [ratingResult] = await pool.query(
      "SELECT AVG(rating) as rating, COUNT(*) as count FROM ratings WHERE store_id = ?",
      [req.user.id],
    )

    const rating = ratingResult[0].rating || 0
    const totalRatings = ratingResult[0].count || 0

    res.json({
      name: storeInfo[0].name,
      address: storeInfo[0].address,
      rating,
      totalRatings,
    })
  } catch (error) {
    console.error("Store dashboard error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

app.get("/api/store/users", authenticateToken, isStoreOwner, async (req, res) => {
  try {
    const { sortField = "name", sortDirection = "asc" } = req.query

    // Validate sort field
    const allowedSortFields = ["name", "email", "rating", "date"]
    const validSortField = allowedSortFields.includes(sortField) ? sortField : "name"

    // Validate sort direction
    const validSortDirection = sortDirection === "desc" ? "DESC" : "ASC"

    // Build query
    let query = `
      SELECT u.id, u.name, u.email, r.rating, r.created_at as ratingDate
      FROM ratings r
      JOIN users u ON r.user_id = u.id
      WHERE r.store_id = ?
    `

    // Add sorting
    if (validSortField === "date") {
      query += ` ORDER BY r.created_at ${validSortDirection}`
    } else if (validSortField === "rating") {
      query += ` ORDER BY r.rating ${validSortDirection}`
    } else {
      query += ` ORDER BY u.${validSortField} ${validSortDirection}`
    }

    const [users] = await pool.query(query, [req.user.id])

    res.json(users)
  } catch (error) {
    console.error("Get users with ratings error:", error)
    res.status(500).json({ message: "Server error" })
  }
})

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
