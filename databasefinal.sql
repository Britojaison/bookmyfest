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
  `eventID` int NOT NULL AUTO_INCREMENT,
  `eventname` varchar(100) DEFAULT NULL,
  `pan_campus` tinyint(1) DEFAULT NULL,
  `audience` varchar(100) DEFAULT NULL,
  `start_date` date DEFAULT NULL,
  `end_date` date DEFAULT NULL,
  `event_time` time DEFAULT NULL,
  `venue` varchar(100) DEFAULT NULL,
  `event_desc` varchar(250) DEFAULT NULL,
  `attendance` tinyint(1) DEFAULT NULL,
  `registration` tinyint(1) DEFAULT NULL,
  `reg_range` int DEFAULT NULL,
  `poster` varchar(500) DEFAULT NULL,
  `categoryID` int DEFAULT NULL,
  `formlink` varchar(500) DEFAULT NULL,
  `hostID` int DEFAULT NULL,
  PRIMARY KEY (`eventID`),
  KEY `categoryID` (`categoryID`),
  KEY `hostID` (`hostID`),
  CONSTRAINT `events_ibfk_1` FOREIGN KEY (`hostID`) REFERENCES `host` (`hostID`)
) ENGINE=InnoDB AUTO_INCREMENT=58 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `events`
--

LOCK TABLES `events` WRITE;
/*!40000 ALTER TABLE `events` DISABLE KEYS */;
INSERT INTO `events` VALUES (1,'Darpan',1,NULL,'2024-04-26','2024-04-26','00:00:00','other','Darpan is the flagship SWO event',0,0,NULL,'\\images\\darpan.png',5,'',1100001),(2,'Interface',0,'Dept. of Computer Science','2024-07-15','2024-07-18',NULL,'main audi','interface is the flagship CUCS event',0,0,NULL,'\\images\\interface.jpg',9,'https://forms.gle/wbPbQa3EGuNPNayb8',1108018),(3,'Gen Quiz',1,NULL,'2024-07-15','2024-04-25','16:15:00','skyview','quiz event for central campus',0,1,1000,'\\images\\genquiz.jpeg',7,'https://forms.gle/wbPbQa3EGuNPNayb8',1108018),(4,'crispo',1,NULL,'2024-03-05','2024-03-27',NULL,'ground','inter campus sport',0,0,NULL,'\\images\\crispo.jpeg',5,'https://forms.gle/wbPbQa3EGuNPNayb8',1100001),(5,'inbloom',1,NULL,'2024-05-17','2024-05-24',NULL,'central campus','inter deanery fest',0,0,NULL,'\\images\\inbloom.jpg',5,'https://forms.gle/wbPbQa3EGuNPNayb8',1100001),(6,'maverick',1,NULL,'2024-05-14','2024-05-17',NULL,'central campus','women premier league',0,0,NULL,'\\images\\maverick.jpg',5,'https://forms.gle/wbPbQa3EGuNPNayb8',8000),(7,'hackathon',1,NULL,'2024-03-23','2024-03-24',NULL,'skyview','coding league',0,0,NULL,'\\images\\hackathon.jpg',9,'https://forms.gle/wbPbQa3EGuNPNayb8',8000),(8,'Cricket',1,NULL,'2024-03-18','2024-03-18','16:00:00','Dharmaram Ground','cricket match btwn SWO and USC',0,0,NULL,'\\images\\cricket.jpg',5,'https://forms.gle/wbPbQa3EGuNPNayb8',1100001),(9,'architecture fest',0,'School of architecture','2024-04-15','2024-04-16',NULL,'kengeri campus','flagship event of school of architecture',0,0,NULL,'\\images\\example.png',9,NULL,1000),(10,'Nritta',1,NULL,'2024-04-06','2024-04-07','05:00:00','main audi','flagship event of arts and humanities',0,0,NULL,'\\images\\example.png',1,NULL,2000),(11,'Vistas',0,'CUSBMA','2024-04-07','2024-04-08',NULL,'main audi','flagship event of CUSBMA',1,0,NULL,'\\images\\example.png',9,NULL,3000),(12,'Prayas',0,'DOC','2024-04-07','2024-04-25',NULL,'main audi','flagship event of DOC',1,0,NULL,'\\images\\example.png',9,NULL,4000),(13,'edufest',1,NULL,'2024-04-15','2024-04-25',NULL,'main audi','educational event',0,0,NULL,'\\images\\example.png',10,NULL,5000),(14,'ECON',1,NULL,'2024-04-20','2024-04-25',NULL,'kengeri campus','engineering conference event',0,0,NULL,'\\images\\example.png',10,NULL,6000),(15,'suits',1,NULL,'2024-04-20','2024-04-25',NULL,'KE audi','law procenium',0,0,NULL,'\\images\\example.png',2,NULL,7000),(16,'pyschshop',1,NULL,'2024-04-20','2024-04-25',NULL,'skyview','workshop on pyschology',0,0,NULL,'\\images\\example.png',6,NULL,9000),(17,'Daksh',1,NULL,'2024-04-20','2024-04-25',NULL,'central campus','flagship fest of student council',0,0,NULL,'\\images\\example.png',9,NULL,1100004),(18,'debate quiz',1,NULL,'2024-04-22','2024-04-25',NULL,'campus view','quiz on various famous debates',0,0,NULL,'\\images\\example.png',7,NULL,1100005),(19,'pratibimb',1,NULL,'2024-04-22','2024-04-25',NULL,'Central campus','flagship event of CEP',0,0,NULL,'\\images\\example.png',9,NULL,1102003),(20,'econ 101',1,NULL,'2024-04-22','2024-04-25',NULL,'Central campus','flagship event of economics department',0,0,NULL,'\\images\\example.png',9,NULL,1108023);
/*!40000 ALTER TABLE `events` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `host`
--

DROP TABLE IF EXISTS `host`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `host` (
  `hostID` int NOT NULL,
  `hostname` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`hostID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `host`
--

LOCK TABLES `host` WRITE;
/*!40000 ALTER TABLE `host` DISABLE KEYS */;
INSERT INTO `host` VALUES (1000,'Architecture'),(2000,'Arts and Humanities'),(3000,'Business and Management'),(4000,'Commerce,Finance and Accountancy'),(5000,'Education'),(6000,'Engineering and Technology'),(7000,'Law'),(8000,'Sciences'),(9000,'Social Sciences'),(1100001,'SWO'),(1100002,'CSA'),(1100003,'ACC'),(1100004,'Student Council'),(1100005,'CUDS'),(1100006,'We Care'),(1100007,'We Jump'),(1100008,'CAPS'),(1100009,'CCA'),(1100010,'Peer Educator'),(1100011,'Labrynth'),(1102001,'English and Cultural Studies'),(1102002,'Languages'),(1102003,'Media Studies'),(1102204,'Performing Arts,Theatre studies and Music'),(1102205,'Philosophy and Theology'),(1103006,'Business and Management'),(1103007,'Hotel Management'),(1103308,'Tourism Management'),(1104009,'commerce'),(1104010,'Professional studies'),(1106011,'Civil Engineering'),(1106012,'Computer Science and Engineering'),(1106013,'Electrical and Electronics Engineering'),(1106014,'Electronics and Communication Engineering'),(1106015,'Mechanical and Automobile Engineering'),(1106016,'Science and Humanities(Engineering)'),(1108017,'Chemistry'),(1108018,'Computer Sciences'),(1108019,'Life Sciences'),(1108020,'Mathematics'),(1108021,'Physics and Electronics'),(1108022,'Statistics and Data Science'),(1108023,'Economics'),(1109024,'Intertional Studies, Political Science and History'),(1109025,'Pyschology'),(1109026,'Sociology and Social Work');
/*!40000 ALTER TABLE `host` ENABLE KEYS */;
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
  CONSTRAINT `fk_eventID` FOREIGN KEY (`eventID`) REFERENCES `events` (`eventID`),
  CONSTRAINT `participated_ibfk_1` FOREIGN KEY (`regno`) REFERENCES `user` (`regno`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `participated`
--

LOCK TABLES `participated` WRITE;
/*!40000 ALTER TABLE `participated` DISABLE KEYS */;
INSERT INTO `participated` VALUES (1,2241110,6),(2,2241110,7),(3,2241110,8);
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
  `password` varchar(255) NOT NULL,
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
INSERT INTO `user` VALUES (8000,'81865974',6782645456,'sos@gmail.com',NULL,'A',NULL),(1100001,'$2a$10$Pan37UhjHZ0fMnWOCNRYC.UER9J10.QwrtCvoeii0SQ9nMZ/ZPvea',4523454567,'swo@christuniversity.in',NULL,'A',NULL),(1108018,'44948739',4623454567,'cucs@christuniversity.in',NULL,'A',NULL),(2230388,'$2b$10$8HW296agpTqhKz06HObyBOEMXTRxCDFNpmqLl9bCo4Pz15bOjwUB.',9538899111,'siddhi.pania@pseng.christuniversity.in',NULL,'S',1),(2241101,'11223344',1234567890,'aaditya.mishra@bca.christuniversity.in',8018,'S',1),(2241102,'11223345',1234567890,'aaryan.singh@bca.christuniversity.in',8018,'S',1),(2241103,'11223346',1234567890,'aayushi.goel@bca.christuniversity.in',8018,'S',1),(2241104,'11223347',1234567890,'abraham@bca.christuniversity.in',8018,'S',1),(2241105,'11223348',1234567890,'adrij.mondal@bca.christuniversity.in',8018,'S',1),(2241106,'11223349',1234567890,'agamjot.dua@bca.christuniversity.in',8018,'S',1),(2241107,'11223340',1234567890,'ahanya.mariam@bca.christuniversity.in',8018,'S',2),(2241108,'11223341',1234567890,'akshay.jaithin@bca.christuniversity.in',8018,'S',2),(2241109,'11223342',1234567890,'akshita.mathur@bca.christuniversity.in',8018,'S',2),(2241110,'$2a$10$w/yHcWC4G3HBLsSs6lK2v.HmnUY9ver5t0bmet72ava66JKDTqEQm',1234567890,'sharma.parth@bca.christuniversity.in',8018,'S',9),(2241111,'11223344',1876543210,'amritha@bca.christuniversity.in',8018,'S',2),(2241112,'11223345',9876543210,'arjun@bca.christuniversity.in',8018,'S',2),(2241150,'$2b$10$aRj7W6yuY9o2JJQYAM/fsu2LBncr72SvbD1oM3tyocgA1drvz47Pq',12345678,'ruchit.dhanuka@gmail.com',8018,'S',9),(2241154,'$2b$10$INi3IB25tnWshCQDCCaYuuthPWAQ8ldANvS0U1jEsOzG6wQz1Xf3O',8092808210,'sakshee.priya@bca.christuniversity.in',NULL,'S',1),(2241159,'$2b$10$dg0D/YIiGV5G1KiC0yB2KO0PYFktAmGgU0IZ81HH0fiKByVlkQCjS',8240849936,'sukrit.saha@bca.christuniversity.in',NULL,'S',8);
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

-- Dump completed on 2024-04-06  9:47:47
