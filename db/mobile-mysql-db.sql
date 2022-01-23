CREATE DATABASE /*!32312 IF NOT EXISTS*/`mobile` /*!40100 DEFAULT CHARACTER SET utf8 */;

USE `mobile`;

/*Table structure for table `clients` */

DROP TABLE IF EXISTS `clients`;

CREATE TABLE `clients` (
  `client_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `idnumber` varchar(20) NOT NULL,
  `fullname` varchar(50) NOT NULL,
  `address` varchar(200) NOT NULL,
  `phonenumber` varchar(20) NOT NULL,
  PRIMARY KEY (`client_id`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8;

/*Data for the table `clients` */

/*Table structure for table `clients_phones` */

DROP TABLE IF EXISTS `clients_phones`;

CREATE TABLE `clients_phones` (
  `phone_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `client_id` int(10) unsigned NOT NULL,
  `brand` varchar(20) NOT NULL,
  `model` varchar(20) NOT NULL,
  `serial` varchar(50) NOT NULL,
  KEY `phone_id` (`phone_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

/*Data for the table `clients_phones` */

/*Table structure for table `clients_phones_repairs` */

DROP TABLE IF EXISTS `clients_phones_repairs`;

CREATE TABLE `clients_phones_repairs` (
  `repair_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `phone_id` int(10) unsigned NOT NULL,
  `failure` varchar(500) NOT NULL,
  `notes` varchar(500) DEFAULT NULL,
  `status` tinyint(3) unsigned NOT NULL DEFAULT 0 COMMENT '0: Por Revisar, 1: Revisado',
  `date_in` datetime NOT NULL,
  `date_repair` datetime DEFAULT NULL,
  PRIMARY KEY (`repair_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

/*Data for the table `clients_phones_repairs` */

/*Table structure for table `users` */

DROP TABLE IF EXISTS `users`;

CREATE TABLE `users` (
  `user_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `fullname` varchar(50) NOT NULL,
  `email` varchar(50) NOT NULL,
  `passw` varchar(255) NOT NULL,
  `role` tinyint(4) NOT NULL DEFAULT 1 COMMENT '0: Admin; 1: Empleado',
  `status` tinyint(4) NOT NULL DEFAULT 0 COMMENT '0: Inactivo; 1: Activo',
  PRIMARY KEY (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8;

/*Data for the table `users` */

insert  into `users`(`user_id`,`fullname`,`email`,`passw`,`role`,`status`) values (1,'Administador','admin@mobile.com','123456',0,1);

