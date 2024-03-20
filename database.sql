-- MySQL dump 10.13  Distrib 8.0.36, for Win64 (x86_64)
--
-- Host: localhost    Database: uems
-- ------------------------------------------------------
-- Server version	8.0.36

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `active_sessions`
--

DROP TABLE IF EXISTS `active_sessions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `active_sessions` (
  `session_id` int NOT NULL AUTO_INCREMENT,
  `user_id` int DEFAULT NULL,
  `login_time` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`session_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `active_sessions_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user` (`regno`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `active_sessions`
--

LOCK TABLES `active_sessions` WRITE;
/*!40000 ALTER TABLE `active_sessions` DISABLE KEYS */;
/*!40000 ALTER TABLE `active_sessions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `category`
--

DROP TABLE IF EXISTS `category`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `category` (
  `category_ID` int NOT NULL,
  `category_name` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`category_ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `category`
--

LOCK TABLES `category` WRITE;
/*!40000 ALTER TABLE `category` DISABLE KEYS */;
INSERT INTO `category` VALUES (1,'dance'),(2,'theatre'),(3,'stage'),(4,'music'),(5,'photography'),(6,'workshop'),(7,'quiz'),(8,'sports'),(9,'fests'),(10,'conference');
/*!40000 ALTER TABLE `category` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `clubs`
--

DROP TABLE IF EXISTS `clubs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `clubs` (
  `clubID` int NOT NULL,
  `clubname` varchar(100) DEFAULT NULL,
  `deptID` int DEFAULT NULL,
  `schoolID` int DEFAULT NULL,
  `pwd` bigint DEFAULT NULL,
  PRIMARY KEY (`clubID`),
  KEY `deptID` (`deptID`),
  KEY `schoolID` (`schoolID`),
  CONSTRAINT `clubs_ibfk_1` FOREIGN KEY (`deptID`) REFERENCES `department` (`deptID`),
  CONSTRAINT `clubs_ibfk_2` FOREIGN KEY (`schoolID`) REFERENCES `school` (`schoolID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `clubs`
--

LOCK TABLES `clubs` WRITE;
/*!40000 ALTER TABLE `clubs` DISABLE KEYS */;
INSERT INTO `clubs` VALUES (1100001,'SWO',NULL,NULL,78304923),(1100002,'CSA',NULL,NULL,97182912),(1100003,'ACC',NULL,NULL,50999797),(1100004,'STUDENT COUNCIL',NULL,NULL,63450252),(1100005,'CUDS',NULL,NULL,64251870),(1100006,'WE CARE',NULL,NULL,30908600),(1100007,'WE JUMP',NULL,NULL,61787391),(1100008,'CAPS',NULL,NULL,16211160),(1100009,'CCA',NULL,NULL,95693632),(1100010,'PEER EDUCATORS',NULL,NULL,29834682),(1108011,'LABRYNTH',8018,8000,62092520);
/*!40000 ALTER TABLE `clubs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `department`
--

DROP TABLE IF EXISTS `department`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `department` (
  `deptID` int NOT NULL,
  `deptname` varchar(100) DEFAULT NULL,
  `schoolID` int DEFAULT NULL,
  `pwd` bigint DEFAULT NULL,
  PRIMARY KEY (`deptID`),
  KEY `schoolID` (`schoolID`),
  CONSTRAINT `department_ibfk_1` FOREIGN KEY (`schoolID`) REFERENCES `school` (`schoolID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `department`
--

LOCK TABLES `department` WRITE;
/*!40000 ALTER TABLE `department` DISABLE KEYS */;
INSERT INTO `department` VALUES (2001,'English and Cultural Studies',2000,20958556),(2002,'Languages',2000,18515225),(2003,'Media Studies',2000,29700460),(2004,'Performing Arts,Theatre studies and Music',2000,92956627),(2005,'Philosophy and Theology',2000,75681760),(3006,'Business and Management',3000,99538922),(3007,'Hotel Management',3000,70649335),(3008,'Tourism Management',3000,54629911),(4009,'Commerce',4000,61201555),(4010,'Professional Studies',4000,42118047),(6011,'Civil Engineering',6000,26985570),(6012,'Computer Science and Engineering',6000,8573716),(6013,'Electrical and Electronics Engineering',6000,61911873),(6014,'Electronics and Communication Engineering',6000,83838220),(6015,'Mechanical and Automobile Engineering',6000,33455486),(6016,'Science and Humanities(Engineering)',6000,15762773),(8017,'Chemistry',8000,78447411),(8018,'Computer Science',8000,44948739),(8019,'Life Sciences',8000,89401464),(8020,'Mathematics',8000,12161106),(8021,'Physics and Electronics',8000,92601144),(8022,'Statistics and Data Science',8000,26522403),(8023,'Economics',8000,54808590),(9024,'International Studies,Political Science and History',9000,94475742),(9025,'Psychology',9000,7952946),(9026,'Sociology and Social Work',9000,56337504);
/*!40000 ALTER TABLE `department` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `events`
--

DROP TABLE IF EXISTS `events`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `events` (
  `eventID` int NOT NULL,
  `eventname` varchar(100) DEFAULT NULL,
  `pan_campus` tinyint(1) DEFAULT NULL,
  `audience` varchar(100) DEFAULT NULL,
  `start_date` date DEFAULT NULL,
  `end_date` date DEFAULT NULL,
  `event_time` time DEFAULT NULL,
  `venue` varchar(100) DEFAULT NULL,
  `event_desc` varchar(250) DEFAULT NULL,
  `attendance` varchar(100) DEFAULT NULL,
  `registration` tinyint(1) DEFAULT NULL,
  `reg_range` int DEFAULT NULL,
  `poster` varchar(500) DEFAULT NULL,
  `categoryID` int DEFAULT NULL,
  `formlink` varchar(500) DEFAULT NULL,
  PRIMARY KEY (`eventID`),
  KEY `categoryID` (`categoryID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `events`
--

LOCK TABLES `events` WRITE;
/*!40000 ALTER TABLE `events` DISABLE KEYS */;
INSERT INTO `events` VALUES (1,'Darpan',1,NULL,'2024-05-15','2024-06-15',NULL,NULL,'Darpan is the flagship SWO event',NULL,NULL,NULL,'\\images\\darpan.png',NULL,NULL),(2,'Interface',0,'Dept. of Computer Science','2024-07-15','2024-07-18',NULL,'main audi','interface is the flagship CUCS event',NULL,NULL,NULL,'\\images\\interface.jpg',9,NULL),(3,'Gen Quiz',1,NULL,'2024-07-15',NULL,'16:15:00','skyview','quiz event for central campus',NULL,1,1000,'\\images\\genquiz.jpeg',7,NULL),(4,'crispo',1,NULL,'2024-03-05','2024-03-27',NULL,'ground','inter campus sport',NULL,NULL,NULL,'\\images\\crispo.jpeg',NULL,NULL),(5,'inbloom',1,NULL,'2024-05-17','2024-05-24',NULL,'central campus','inter deanery fest',NULL,NULL,NULL,'\\images\\inbloom.jpg',NULL,NULL),(6,'maverick',1,NULL,'2024-05-14','2024-05-17',NULL,'central campus','women premier league',NULL,NULL,NULL,'\\images\\maverick.jpg',NULL,NULL),(7,'hackathon',1,NULL,'2024-03-23','2024-03-24',NULL,'skyview','coding league',NULL,NULL,NULL,'\\images\\hackathon.jpg',9,NULL);
/*!40000 ALTER TABLE `events` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `participated`
--

DROP TABLE IF EXISTS `participated`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `participated` (
  `regID` int NOT NULL,
  `regno` int DEFAULT NULL,
  `eventID` int DEFAULT NULL,
  PRIMARY KEY (`regID`),
  KEY `regno` (`regno`),
  KEY `eventID` (`eventID`),
  CONSTRAINT `participated_ibfk_1` FOREIGN KEY (`regno`) REFERENCES `user` (`regno`),
  CONSTRAINT `participated_ibfk_2` FOREIGN KEY (`eventID`) REFERENCES `events` (`eventID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `participated`
--

LOCK TABLES `participated` WRITE;
/*!40000 ALTER TABLE `participated` DISABLE KEYS */;
/*!40000 ALTER TABLE `participated` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `school`
--

DROP TABLE IF EXISTS `school`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `school` (
  `schoolID` int NOT NULL,
  `schoolname` varchar(100) DEFAULT NULL,
  `pwd` bigint DEFAULT NULL,
  PRIMARY KEY (`schoolID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `school`
--

LOCK TABLES `school` WRITE;
/*!40000 ALTER TABLE `school` DISABLE KEYS */;
INSERT INTO `school` VALUES (1000,'Architecure',75820582),(2000,'Arts and Humanities',4742445),(3000,'Business and Management',96250479),(4000,'Commerce,Finance and Accountancy',67025066),(5000,'Education',46373897),(6000,'Engineering and Technology',30794292),(7000,'Law',14849769),(8000,'Sciences',81865974),(9000,'Social Sciences',64780569);
/*!40000 ALTER TABLE `school` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user` (
  `regno` int NOT NULL,
  `password` int DEFAULT NULL,
  `mobile_no` bigint DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `dept_ID` int DEFAULT NULL,
  `role` varchar(1) DEFAULT NULL,
  `categoryID` int DEFAULT NULL,
  PRIMARY KEY (`regno`),
  KEY `dept_ID` (`dept_ID`),
  KEY `fk_user_category` (`categoryID`),
  CONSTRAINT `fk_user_category` FOREIGN KEY (`categoryID`) REFERENCES `category` (`category_ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES (1100001,78304923,4523454567,'swo@christuniversity.in',NULL,'A',NULL),(1108018,44948739,4623454567,'cucs@christuniversity.in',NULL,'A',NULL),(2241101,11223344,1234567890,'aaditya.mishra@bca.christuniversity.in',18,'S',1),(2241102,11223345,1234567890,'aaryan.singh@bca.christuniversity.in',18,'S',1),(2241103,11223346,1234567890,'aayushi.goel@bca.christuniversity.in',18,'S',1),(2241104,11223347,1234567890,'abraham@bca.christuniversity.in',18,'S',1),(2241105,11223348,1234567890,'adrij.mondal@bca.christuniversity.in',18,'S',1),(2241106,11223349,1234567890,'agamjot.dua@bca.christuniversity.in',18,'S',1),(2241107,11223340,1234567890,'ahanya.mariam@bca.christuniversity.in',18,'S',2),(2241108,11223341,1234567890,'akshay.jaithin@bca.christuniversity.in',18,'S',2),(2241109,11223342,1234567890,'akshita.mathur@bca.christuniversity.in',18,'S',2),(2241110,11223343,1234567890,'alan.joshy@bca.christuniversity.in',18,'S',9),(2241111,11223344,1876543210,'amritha@bca.christuniversity.in',18,'S',2),(2241112,11223345,9876543210,'arjun@bca.christuniversity.in',18,'S',2);
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-03-20  0:27:29
