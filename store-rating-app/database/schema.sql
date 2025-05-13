-- Create database
CREATE DATABASE IF NOT EXISTS store_rating_system;
USE store_rating_system;

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(60) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  address VARCHAR(400) NOT NULL,
  role ENUM('admin', 'user', 'store') NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Ratings table
CREATE TABLE IF NOT EXISTS ratings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  store_id INT NOT NULL,
  rating INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (store_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE KEY user_store_unique (user_id, store_id)
);

-- Create admin user
INSERT INTO users (name, email, password, address, role)
VALUES (
  'System Administrator',
  'admin@example.com',
  '$2a$10$JcmAHe5eUZ2XN4H/GxXP2.K2PUBPzw9Z9c9Q.0Y4hvPHdGp8FBpLO', -- Password: Admin@123
  'Admin Office, Headquarters Building, New Delhi, India',
  'admin'
);

-- Create sample stores
INSERT INTO users (name, email, password, address, role) VALUES
('Sharma General Store and Grocery Supplies', 'sharma@example.com', '$2a$10$JcmAHe5eUZ2XN4H/GxXP2.K2PUBPzw9Z9c9Q.0Y4hvPHdGp8FBpLO', 'Shop No. 12, Market Complex, Connaught Place, New Delhi, India', 'store'),
('Patel Electronics and Home Appliances', 'patel@example.com', '$2a$10$JcmAHe5eUZ2XN4H/GxXP2.K2PUBPzw9Z9c9Q.0Y4hvPHdGp8FBpLO', '45 Gandhi Road, Ahmedabad, Gujarat, India', 'store'),
('Singh Pharmacy and Medical Supplies', 'singh@example.com', '$2a$10$JcmAHe5eUZ2XN4H/GxXP2.K2PUBPzw9Z9c9Q.0Y4hvPHdGp8FBpLO', '78 Hospital Lane, Amritsar, Punjab, India', 'store'),
('Gupta Fashion Boutique and Textiles', 'gupta@example.com', '$2a$10$JcmAHe5eUZ2XN4H/GxXP2.K2PUBPzw9Z9c9Q.0Y4hvPHdGp8FBpLO', 'Shop 23, Fashion Street, Mumbai, Maharashtra, India', 'store'),
('Reddy South Indian Restaurant', 'reddy@example.com', '$2a$10$JcmAHe5eUZ2XN4H/GxXP2.K2PUBPzw9Z9c9Q.0Y4hvPHdGp8FBpLO', '56 Food Court, Hyderabad, Telangana, India', 'store'),
('Joshi Books and Stationery Store', 'joshi@example.com', '$2a$10$JcmAHe5eUZ2XN4H/GxXP2.K2PUBPzw9Z9c9Q.0Y4hvPHdGp8FBpLO', '34 College Road, Pune, Maharashtra, India', 'store'),
('Kumar Mobile and Computer Accessories', 'kumar@example.com', '$2a$10$JcmAHe5eUZ2XN4H/GxXP2.K2PUBPzw9Z9c9Q.0Y4hvPHdGp8FBpLO', 'Shop 7, Tech Plaza, Bangalore, Karnataka, India', 'store'),
('Verma Sweets and Confectionery', 'verma@example.com', '$2a$10$JcmAHe5eUZ2XN4H/GxXP2.K2PUBPzw9Z9c9Q.0Y4hvPHdGp8FBpLO', '12 Sweet Lane, Jaipur, Rajasthan, India', 'store'),
('Mishra Handicrafts and Souvenirs', 'mishra@example.com', '$2a$10$JcmAHe5eUZ2XN4H/GxXP2.K2PUBPzw9Z9c9Q.0Y4hvPHdGp8FBpLO', '89 Tourist Market, Varanasi, Uttar Pradesh, India', 'store'),
('Agarwal Jewellers and Precious Gems', 'agarwal@example.com', '$2a$10$JcmAHe5eUZ2XN4H/GxXP2.K2PUBPzw9Z9c9Q.0Y4hvPHdGp8FBpLO', '67 Diamond Street, Surat, Gujarat, India', 'store');

-- Create sample users
INSERT INTO users (name, email, password, address, role) VALUES
('Rajesh Kumar Sharma from Delhi', 'rajesh@example.com', '$2a$10$JcmAHe5eUZ2XN4H/GxXP2.K2PUBPzw9Z9c9Q.0Y4hvPHdGp8FBpLO', 'Flat 302, Sunshine Apartments, Rohini, Delhi, India', 'user'),
('Priya Patel from Mumbai City', 'priya@example.com', '$2a$10$JcmAHe5eUZ2XN4H/GxXP2.K2PUBPzw9Z9c9Q.0Y4hvPHdGp8FBpLO', '45 Marine Drive, Colaba, Mumbai, Maharashtra, India', 'user'),
('Amit Singh from Chandigarh', 'amit@example.com', '$2a$10$JcmAHe5eUZ2XN4H/GxXP2.K2PUBPzw9Z9c9Q.0Y4hvPHdGp8FBpLO', 'House 123, Sector 17, Chandigarh, India', 'user'),
('Sunita Gupta from Kolkata', 'sunita@example.com', '$2a$10$JcmAHe5eUZ2XN4H/GxXP2.K2PUBPzw9Z9c9Q.0Y4hvPHdGp8FBpLO', '78 Park Street, Kolkata, West Bengal, India', 'user'),
('Venkat Reddy from Hyderabad', 'venkat@example.com', '$2a$10$JcmAHe5eUZ2XN4H/GxXP2.K2PUBPzw9Z9c9Q.0Y4hvPHdGp8FBpLO', 'Flat 405, Cyber Towers, Hitech City, Hyderabad, Telangana, India', 'user'),
('Ananya Joshi from Bangalore', 'ananya@example.com', '$2a$10$JcmAHe5eUZ2XN4H/GxXP2.K2PUBPzw9Z9c9Q.0Y4hvPHdGp8FBpLO', '56 MG Road, Indiranagar, Bangalore, Karnataka, India', 'user'),
('Rahul Kumar from Chennai City', 'rahul@example.com', '$2a$10$JcmAHe5eUZ2XN4H/GxXP2.K2PUBPzw9Z9c9Q.0Y4hvPHdGp8FBpLO', '23 Anna Nagar, Chennai, Tamil Nadu, India', 'user'),
('Meera Verma from Jaipur City', 'meera@example.com', '$2a$10$JcmAHe5eUZ2XN4H/GxXP2.K2PUBPzw9Z9c9Q.0Y4hvPHdGp8FBpLO', '89 Civil Lines, Jaipur, Rajasthan, India', 'user'),
('Sanjay Mishra from Lucknow', 'sanjay@example.com', '$2a$10$JcmAHe5eUZ2XN4H/GxXP2.K2PUBPzw9Z9c9Q.0Y4hvPHdGp8FBpLO', '34 Hazratganj, Lucknow, Uttar Pradesh, India', 'user'),
('Neha Agarwal from Ahmedabad', 'neha@example.com', '$2a$10$JcmAHe5eUZ2XN4H/GxXP2.K2PUBPzw9Z9c9Q.0Y4hvPHdGp8FBpLO', '67 CG Road, Navrangpura, Ahmedabad, Gujarat, India', 'user'),
('Vikram Desai from Pune City', 'vikram@example.com', '$2a$10$JcmAHe5eUZ2XN4H/GxXP2.K2PUBPzw9Z9c9Q.0Y4hvPHdGp8FBpLO', '12 Koregaon Park, Pune, Maharashtra, India', 'user'),
('Kavita Nair from Kochi City', 'kavita@example.com', '$2a$10$JcmAHe5eUZ2XN4H/GxXP2.K2PUBPzw9Z9c9Q.0Y4hvPHdGp8FBpLO', '45 Marine Drive, Kochi, Kerala, India', 'user'),
('Deepak Malhotra from Gurgaon', 'deepak@example.com', '$2a$10$JcmAHe5eUZ2XN4H/GxXP2.K2PUBPzw9Z9c9Q.0Y4hvPHdGp8FBpLO', 'Apartment 505, DLF Phase 3, Gurgaon, Haryana, India', 'user'),
('Anjali Saxena from Bhopal', 'anjali@example.com', '$2a$10$JcmAHe5eUZ2XN4H/GxXP2.K2PUBPzw9Z9c9Q.0Y4hvPHdGp8FBpLO', '78 MP Nagar, Bhopal, Madhya Pradesh, India', 'user'),
('Ravi Menon from Trivandrum', 'ravi@example.com', '$2a$10$JcmAHe5eUZ2XN4H/GxXP2.K2PUBPzw9Z9c9Q.0Y4hvPHdGp8FBpLO', '23 Technopark, Trivandrum, Kerala, India', 'user'),
('Pooja Iyer from Coimbatore', 'pooja@example.com', '$2a$10$JcmAHe5eUZ2XN4H/GxXP2.K2PUBPzw9Z9c9Q.0Y4hvPHdGp8FBpLO', '56 RS Puram, Coimbatore, Tamil Nadu, India', 'user'),
('Arjun Mehta from Indore City', 'arjun@example.com', '$2a$10$JcmAHe5eUZ2XN4H/GxXP2.K2PUBPzw9Z9c9Q.0Y4hvPHdGp8FBpLO', '89 Vijay Nagar, Indore, Madhya Pradesh, India', 'user'),
('Divya Chauhan from Dehradun', 'divya@example.com', '$2a$10$JcmAHe5eUZ2XN4H/GxXP2.K2PUBPzw9Z9c9Q.0Y4hvPHdGp8FBpLO', '34 Rajpur Road, Dehradun, Uttarakhand, India', 'user'),
('Kiran Rao from Visakhapatnam', 'kiran@example.com', '$2a$10$JcmAHe5eUZ2XN4H/GxXP2.K2PUBPzw9Z9c9Q.0Y4hvPHdGp8FBpLO', '67 Beach Road, Visakhapatnam, Andhra Pradesh, India', 'user'),
('Manoj Tiwari from Patna City', 'manoj@example.com', '$2a$10$JcmAHe5eUZ2XN4H/GxXP2.K2PUBPzw9Z9c9Q.0Y4hvPHdGp8FBpLO', '12 Gandhi Maidan, Patna, Bihar, India', 'user'),
('Lakshmi Krishnan from Chennai', 'lakshmi@example.com', '$2a$10$JcmAHe5eUZ2XN4H/GxXP2.K2PUBPzw9Z9c9Q.0Y4hvPHdGp8FBpLO', '45 T Nagar, Chennai, Tamil Nadu, India', 'user'),
('Suresh Pillai from Kochi Area', 'suresh@example.com', '$2a$10$JcmAHe5eUZ2XN4H/GxXP2.K2PUBPzw9Z9c9Q.0Y4hvPHdGp8FBpLO', '78 Ernakulam, Kochi, Kerala, India', 'user'),
('Geeta Banerjee from Kolkata', 'geeta@example.com', '$2a$10$JcmAHe5eUZ2XN4H/GxXP2.K2PUBPzw9Z9c9Q.0Y4hvPHdGp8FBpLO', '23 Salt Lake City, Kolkata, West Bengal, India', 'user'),
('Prakash Jha from Ranchi City', 'prakash@example.com', '$2a$10$JcmAHe5eUZ2XN4H/GxXP2.K2PUBPzw9Z9c9Q.0Y4hvPHdGp8FBpLO', '56 Main Road, Ranchi, Jharkhand, India', 'user'),
('Shweta Kapoor from Mumbai Area', 'shweta@example.com', '$2a$10$JcmAHe5eUZ2XN4H/GxXP2.K2PUBPzw9Z9c9Q.0Y4hvPHdGp8FBpLO', '89 Andheri West, Mumbai, Maharashtra, India', 'user'),
('Vivek Khanna from Chandigarh', 'vivek@example.com', '$2a$10$JcmAHe5eUZ2XN4H/GxXP2.K2PUBPzw9Z9c9Q.0Y4hvPHdGp8FBpLO', '34 Sector 22, Chandigarh, India', 'user'),
('Nandini Reddy from Hyderabad', 'nandini@example.com', '$2a$10$JcmAHe5eUZ2XN4H/GxXP2.K2PUBPzw9Z9c9Q.0Y4hvPHdGp8FBpLO', '67 Banjara Hills, Hyderabad, Telangana, India', 'user'),
('Ajay Mathur from Delhi Region', 'ajay@example.com', '$2a$10$JcmAHe5eUZ2XN4H/GxXP2.K2PUBPzw9Z9c9Q.0Y4hvPHdGp8FBpLO', '12 Connaught Place, New Delhi, India', 'user'),
('Sarita Patel from Vadodara', 'sarita@example.com', '$2a$10$JcmAHe5eUZ2XN4H/GxXP2.K2PUBPzw9Z9c9Q.0Y4hvPHdGp8FBpLO', '45 Alkapuri, Vadodara, Gujarat, India', 'user'),
('Mohan Lal from Jaipur Area', 'mohan@example.com', '$2a$10$JcmAHe5eUZ2XN4H/GxXP2.K2PUBPzw9Z9c9Q.0Y4hvPHdGp8FBpLO', '78 Malviya Nagar, Jaipur, Rajasthan, India', 'user'),
('Aarti Sharma from Lucknow', 'aarti@example.com', '$2a$10$JcmAHe5eUZ2XN4H/GxXP2.K2PUBPzw9Z9c9Q.0Y4hvPHdGp8FBpLO', '23 Gomti Nagar, Lucknow, Uttar Pradesh, India', 'user'),
('Rajiv Bhatia from Amritsar', 'rajiv@example.com', '$2a$10$JcmAHe5eUZ2XN4H/GxXP2.K2PUBPzw9Z9c9Q.0Y4hvPHdGp8FBpLO', '56 Lawrence Road, Amritsar, Punjab, India', 'user'),
('Usha Rani from Mysore City', 'usha@example.com', '$2a$10$JcmAHe5eUZ2XN4H/GxXP2.K2PUBPzw9Z9c9Q.0Y4hvPHdGp8FBpLO', '89 Chamundi Hills, Mysore, Karnataka, India', 'user'),
('Dinesh Choudhary from Jodhpur', 'dinesh@example.com', '$2a$10$JcmAHe5eUZ2XN4H/GxXP2.K2PUBPzw9Z9c9Q.0Y4hvPHdGp8FBpLO', '34 Clock Tower, Jodhpur, Rajasthan, India', 'user'),
('Rekha Menon from Kottayam', 'rekha@example.com', '$2a$10$JcmAHe5eUZ2XN4H/GxXP2.K2PUBPzw9Z9c9Q.0Y4hvPHdGp8FBpLO', '67 Baker Junction, Kottayam, Kerala, India', 'user'),
('Alok Srivastava from Allahabad', 'alok@example.com', '$2a$10$JcmAHe5eUZ2XN4H/GxXP2.K2PUBPzw9Z9c9Q.0Y4hvPHdGp8FBpLO', '12 Civil Lines, Allahabad, Uttar Pradesh, India', 'user'),
('Jyoti Deshmukh from Nagpur', 'jyoti@example.com', '$2a$10$JcmAHe5eUZ2XN4H/GxXP2.K2PUBPzw9Z9c9Q.0Y4hvPHdGp8FBpLO', '45 Dharampeth, Nagpur, Maharashtra, India', 'user'),
('Harish Verma from Shimla City', 'harish@example.com', '$2a$10$JcmAHe5eUZ2XN4H/GxXP2.K2PUBPzw9Z9c9Q.0Y4hvPHdGp8FBpLO', '78 Mall Road, Shimla, Himachal Pradesh, India', 'user'),
('Sheela Gowda from Mangalore', 'sheela@example.com', '$2a$10$JcmAHe5eUZ2XN4H/GxXP2.K2PUBPzw9Z9c9Q.0Y4hvPHdGp8FBpLO', '23 Balmatta Road, Mangalore, Karnataka, India', 'user'),
('Ramesh Nair from Thiruvananthapuram', 'ramesh@example.com', '$2a$10$JcmAHe5eUZ2XN4H/GxXP2.K2PUBPzw9Z9c9Q.0Y4hvPHdGp8FBpLO', '56 Kowdiar, Thiruvananthapuram, Kerala, India', 'user'),
('Shalini Gupta from Kanpur City', 'shalini@example.com', '$2a$10$JcmAHe5eUZ2XN4H/GxXP2.K2PUBPzw9Z9c9Q.0Y4hvPHdGp8FBpLO', '89 Civil Lines, Kanpur, Uttar Pradesh, India', 'user'),
('Vinod Khosla from Ludhiana', 'vinod@example.com', '$2a$10$JcmAHe5eUZ2XN4H/GxXP2.K2PUBPzw9Z9c9Q.0Y4hvPHdGp8FBpLO', '34 Model Town, Ludhiana, Punjab, India', 'user'),
('Sudha Murthy from Hubli City', 'sudha@example.com', '$2a$10$JcmAHe5eUZ2XN4H/GxXP2.K2PUBPzw9Z9c9Q.0Y4hvPHdGp8FBpLO', '67 Vidyanagar, Hubli, Karnataka, India', 'user'),
('Anil Kumar from Guwahati Area', 'anil@example.com', '$2a$10$JcmAHe5eUZ2XN4H/GxXP2.K2PUBPzw9Z9c9Q.0Y4hvPHdGp8FBpLO', '12 GS Road, Guwahati, Assam, India', 'user'),
('Radha Krishnan from Madurai', 'radha@example.com', '$2a$10$JcmAHe5eUZ2XN4H/GxXP2.K2PUBPzw9Z9c9Q.0Y4hvPHdGp8FBpLO', '45 East Masi Street, Madurai, Tamil Nadu, India', 'user'),
('Gopal Yadav from Varanasi City', 'gopal@example.com', '$2a$10$JcmAHe5eUZ2XN4H/GxXP2.K2PUBPzw9Z9c9Q.0Y4hvPHdGp8FBpLO', '78 Assi Ghat, Varanasi, Uttar Pradesh, India', 'user'),
('Lata Mangeshkar from Indore', 'lata@example.com', '$2a$10$JcmAHe5eUZ2XN4H/GxXP2.K2PUBPzw9Z9c9Q.0Y4hvPHdGp8FBpLO', '23 Palasia, Indore, Madhya Pradesh, India', 'user'),
('Kamal Hassan from Coimbatore', 'kamal@example.com', '$2a$10$JcmAHe5eUZ2XN4H/GxXP2.K2PUBPzw9Z9c9Q.0Y4hvPHdGp8FBpLO', '56 Race Course, Coimbatore, Tamil Nadu, India', 'user');

-- Insert sample ratings
INSERT INTO ratings (user_id, store_id, rating) VALUES
(11, 2, 4), (12, 2, 5), (13, 2, 3), (14, 2, 4), (15, 2, 5),
(16, 3, 5), (17, 3, 4), (18, 3, 5), (19, 3, 3), (20, 3, 4),
(21, 4, 3), (22, 4, 2), (23, 4, 3), (24, 4, 4), (25, 4, 3),
(26, 5, 5), (27, 5, 4), (28, 5, 5), (29, 5, 4), (30, 5, 5),
(31, 6, 2), (32, 6, 3), (33, 6, 2), (34, 6, 3), (35, 6, 2),
(36, 7, 4), (37, 7, 5), (38, 7, 4), (39, 7, 3), (40, 7, 4),
(41, 8, 5), (42, 8, 4), (43, 8, 5), (44, 8, 5), (45, 8, 4),
(46, 9, 3), (47, 9, 4), (48, 9, 3), (49, 9, 2), (50, 9, 3),
(51, 10, 5), (52, 10, 4), (53, 10, 5), (54, 10, 4), (55, 10, 5),
(56, 11, 4), (57, 11, 3), (58, 11, 4), (59, 11, 5), (60, 11, 4);
