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
INSERT INTO `category` VALUES (1,'dance'),(2,'theatre'),(3,'stage'),(4,'music'),(6,'workshop'),(7,'quiz'),(8,'sports'),(9,'fests'),(10,'conference');
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
  `club_pwd` int DEFAULT NULL,
  `deptID` int DEFAULT NULL,
  `schoolID` int DEFAULT NULL,
  PRIMARY KEY (`clubID`),
  UNIQUE KEY `clubname` (`clubname`),
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
INSERT INTO `clubs` VALUES (1,'SWO',12345678,NULL,NULL),(2,'CSA',23456789,NULL,NULL),(3,'ACC',34567890,NULL,NULL),(4,'STUDENT COUNCIL',45678901,NULL,NULL),(5,'CUDS',56789012,NULL,NULL),(6,'WE CARE',67890123,NULL,NULL),(7,'WE JUMP',89012345,NULL,NULL),(8,'CAPS',90123456,NULL,NULL),(9,'CCA',1234567,NULL,NULL),(10,'PEER EDUCATORS',11223344,NULL,NULL),(11,'LABRINTH',1234567,18,8),(12,'GDSC',2345678,18,8);
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
  `dept_name` varchar(100) DEFAULT NULL,
  `school_ID` int DEFAULT NULL,
  PRIMARY KEY (`deptID`),
  KEY `school_ID` (`school_ID`),
  CONSTRAINT `department_ibfk_1` FOREIGN KEY (`school_ID`) REFERENCES `school` (`schoolID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `department`
--

LOCK TABLES `department` WRITE;
/*!40000 ALTER TABLE `department` DISABLE KEYS */;
INSERT INTO `department` VALUES (1,'english and cultural studies',2),(2,'languages',2),(3,'media studies',2),(4,'performing arts,theatre studies and music',2),(5,'philosophy and theology',2),(6,'business and management',3),(7,'hotel management',3),(8,'tourism management',3),(9,'commerce',4),(10,'professional studies',4),(11,'civil engineering',6),(12,'computer science and engineering',6),(13,'electrical and electronics engineering',6),(14,'electronics and communication engineering',6),(15,'mechanical and automobile engineering',6),(16,'science and humanities(engineering)',6),(17,'chemistry',8),(18,'computer sciences',8),(19,'life sciences',8),(20,'mathematics',8),(21,'physics and electronics',8),(22,'statistics and data science',8),(23,'economics',9),(24,'international studies,political science and history',9),(25,'psychology',9),(26,'sociology and social work',9);
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
  `clubID` int DEFAULT NULL,
  `deptID` int DEFAULT NULL,
  `schoolID` int DEFAULT NULL,
  `categoryID` int DEFAULT NULL,
  PRIMARY KEY (`eventID`),
  KEY `clubID` (`clubID`),
  KEY `deptID` (`deptID`),
  KEY `schoolID` (`schoolID`),
  KEY `categoryID` (`categoryID`),
  CONSTRAINT `events_ibfk_1` FOREIGN KEY (`clubID`) REFERENCES `clubs` (`clubID`),
  CONSTRAINT `events_ibfk_2` FOREIGN KEY (`deptID`) REFERENCES `department` (`deptID`),
  CONSTRAINT `events_ibfk_3` FOREIGN KEY (`schoolID`) REFERENCES `school` (`schoolID`),
  CONSTRAINT `events_ibfk_4` FOREIGN KEY (`categoryID`) REFERENCES `category` (`category_ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `events`
--

LOCK TABLES `events` WRITE;
/*!40000 ALTER TABLE `events` DISABLE KEYS */;
/*!40000 ALTER TABLE `events` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `participated`
--

DROP TABLE IF EXISTS `participated`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `participated` (
  `regno` int DEFAULT NULL,
  `eventID` int DEFAULT NULL,
  `subeventID` int DEFAULT NULL,
  KEY `regno` (`regno`),
  KEY `eventID` (`eventID`),
  KEY `subeventID` (`subeventID`),
  CONSTRAINT `participated_ibfk_1` FOREIGN KEY (`regno`) REFERENCES `user` (`regno`),
  CONSTRAINT `participated_ibfk_2` FOREIGN KEY (`eventID`) REFERENCES `events` (`eventID`),
  CONSTRAINT `participated_ibfk_3` FOREIGN KEY (`subeventID`) REFERENCES `subevents` (`subeventID`)
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
  `sname` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`schoolID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `school`
--

LOCK TABLES `school` WRITE;
/*!40000 ALTER TABLE `school` DISABLE KEYS */;
INSERT INTO `school` VALUES (1,'school of architecture'),(2,'school of arts and humanities'),(3,'school of business and management'),(4,'school of commerce,finance and accountancy'),(5,'school of education'),(6,'school of engineering and technology'),(7,'school of law'),(8,'school of sciences'),(9,'school of social sciences');
/*!40000 ALTER TABLE `school` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `subevents`
--

DROP TABLE IF EXISTS `subevents`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `subevents` (
  `subeventID` int NOT NULL,
  `svent_name` varchar(100) DEFAULT NULL,
  `pan_campus` tinyint(1) DEFAULT NULL,
  `audience` varchar(100) DEFAULT NULL,
  `start_date` date DEFAULT NULL,
  `end_date` date DEFAULT NULL,
  `sevent_time` time DEFAULT NULL,
  `venue` varchar(100) DEFAULT NULL,
  `sevent_desc` varchar(250) DEFAULT NULL,
  `poster` varchar(500) DEFAULT NULL,
  `attendance` varchar(100) DEFAULT NULL,
  `registration` tinyint(1) DEFAULT NULL,
  `sevent_range` int DEFAULT NULL,
  `eventID` int DEFAULT NULL,
  `categoryID` int DEFAULT NULL,
  `schoolID` int DEFAULT NULL,
  `deptID` int DEFAULT NULL,
  `clubID` int DEFAULT NULL,
  PRIMARY KEY (`subeventID`),
  KEY `eventID` (`eventID`),
  KEY `categoryID` (`categoryID`),
  KEY `schoolID` (`schoolID`),
  KEY `deptID` (`deptID`),
  KEY `clubID` (`clubID`),
  CONSTRAINT `subevents_ibfk_1` FOREIGN KEY (`eventID`) REFERENCES `events` (`eventID`),
  CONSTRAINT `subevents_ibfk_2` FOREIGN KEY (`categoryID`) REFERENCES `category` (`category_ID`),
  CONSTRAINT `subevents_ibfk_3` FOREIGN KEY (`schoolID`) REFERENCES `school` (`schoolID`),
  CONSTRAINT `subevents_ibfk_4` FOREIGN KEY (`deptID`) REFERENCES `department` (`deptID`),
  CONSTRAINT `subevents_ibfk_5` FOREIGN KEY (`clubID`) REFERENCES `clubs` (`clubID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `subevents`
--

LOCK TABLES `subevents` WRITE;
/*!40000 ALTER TABLE `subevents` DISABLE KEYS */;
/*!40000 ALTER TABLE `subevents` ENABLE KEYS */;
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
  `mobile_no` int DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `dept_ID` int DEFAULT NULL,
  PRIMARY KEY (`regno`),
  KEY `dept_ID` (`dept_ID`),
  CONSTRAINT `user_ibfk_1` FOREIGN KEY (`dept_ID`) REFERENCES `department` (`deptID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES (2241101,11223344,1234567890,'aaditya.mishra@bca.christuniversity.in',18),(2241102,11223345,1234567890,'aaryan.singh@bca.christuniversity.in',18),(2241103,11223346,1234567890,'aayushi.goel@bca.christuniversity.in',18),(2241104,11223347,1234567890,'abraham@bca.christuniversity.in',18),(2241105,11223348,1234567890,'adrij.mondal@bca.christuniversity.in',18),(2241106,11223349,1234567890,'agamjot.dua@bca.christuniversity.in',18),(2241107,11223340,1234567890,'ahanya.mariam@bca.christuniversity.in',18),(2241108,11223341,1234567890,'akshay.jaithin@bca.christuniversity.in',18),(2241109,11223342,1234567890,'akshita.mathur@bca.christuniversity.in',18),(2241110,11223343,1234567890,'alan.joshy@bca.christuniversity.in',18);
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

-- Dump completed on 2024-02-20 22:35:13
