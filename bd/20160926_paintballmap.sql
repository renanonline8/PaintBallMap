-- phpMyAdmin SQL Dump
-- version 4.1.14
-- http://www.phpmyadmin.net
--
-- Host: 127.0.0.1
-- Generation Time: 27-Set-2016 às 03:35
-- Versão do servidor: 5.6.17
-- PHP Version: 5.5.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Database: `paintballmap`
--

-- --------------------------------------------------------

--
-- Estrutura da tabela `map`
--

CREATE TABLE IF NOT EXISTS `map` (
  `mapID` int(6) unsigned NOT NULL AUTO_INCREMENT,
  `nickname` varchar(30) DEFAULT NULL,
  PRIMARY KEY (`mapID`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=2 ;

--
-- Extraindo dados da tabela `map`
--

INSERT INTO `map` (`mapID`, `nickname`) VALUES
(1, 'myhome');

-- --------------------------------------------------------

--
-- Estrutura da tabela `maplatlng`
--

CREATE TABLE IF NOT EXISTS `maplatlng` (
  `LatLngID` int(6) unsigned NOT NULL AUTO_INCREMENT,
  `mapID` int(6) DEFAULT NULL,
  `LatVal` double DEFAULT NULL,
  `LngVal` double DEFAULT NULL,
  `orderPos` int(3) DEFAULT NULL,
  PRIMARY KEY (`LatLngID`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=7 ;

--
-- Extraindo dados da tabela `maplatlng`
--

INSERT INTO `maplatlng` (`LatLngID`, `mapID`, `LatVal`, `LngVal`, `orderPos`) VALUES
(1, 1, -23.670067, -46.489367, 1),
(2, 1, -23.66997, -46.490266, 2),
(3, 1, -23.669589, -46.490875, 3),
(4, 1, -23.670049, -46.491231, 4),
(5, 1, -23.670609, -46.490448, 5),
(6, 1, -23.670619, -46.48944, 6);

-- --------------------------------------------------------

--
-- Estrutura da tabela `matchs`
--

CREATE TABLE IF NOT EXISTS `matchs` (
  `PlayerID` int(11) NOT NULL,
  `MatchID` int(11) DEFAULT NULL,
  `Nickname` varchar(255) DEFAULT NULL,
  `Latitude` varchar(255) DEFAULT NULL,
  `Longitude` varchar(255) DEFAULT NULL,
  `MapID` int(11) DEFAULT NULL,
  PRIMARY KEY (`PlayerID`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Extraindo dados da tabela `matchs`
--

INSERT INTO `matchs` (`PlayerID`, `MatchID`, `Nickname`, `Latitude`, `Longitude`, `MapID`) VALUES
(1, 1, 'Carlos', '-25', '27', NULL),
(2, 2, 'Renan', NULL, NULL, NULL),
(3, 3, 'Mar', NULL, NULL, NULL),
(4, 4, 'F', NULL, NULL, NULL),
(5, 5, 'F', NULL, NULL, NULL),
(6, 6, 'A', NULL, NULL, NULL),
(7, 7, 'B', NULL, NULL, NULL),
(8, 8, '3', NULL, NULL, NULL),
(9, 9, '5', NULL, NULL, NULL),
(10, 10, 'U', NULL, NULL, NULL),
(11, 11, 'T', NULL, NULL, NULL),
(12, 12, 'T', NULL, NULL, NULL),
(13, 13, 'T', NULL, NULL, NULL),
(14, 14, 'T', NULL, NULL, NULL),
(15, 15, 'T', NULL, NULL, NULL),
(16, 16, '', NULL, NULL, NULL),
(17, 17, '', NULL, NULL, NULL),
(18, 18, 'D', NULL, NULL, NULL),
(19, 19, 'T', NULL, NULL, NULL),
(20, 20, '', NULL, NULL, NULL),
(21, 21, '', NULL, NULL, NULL),
(22, 22, '', NULL, NULL, NULL),
(23, 23, 'G', NULL, NULL, NULL),
(24, 24, 'G', NULL, NULL, NULL),
(25, 2, '', NULL, NULL, NULL),
(26, 2, 'joker', NULL, NULL, NULL),
(27, 2, '', NULL, NULL, NULL),
(28, 3, 'painter', NULL, NULL, NULL),
(29, 25, 'joker', NULL, NULL, NULL),
(30, 26, 'joker', NULL, NULL, NULL),
(31, 27, '', NULL, NULL, NULL),
(32, 28, 'joker2', NULL, NULL, NULL),
(33, 29, 'a', NULL, NULL, NULL),
(34, 3, 'joker', NULL, NULL, NULL),
(35, 3, 'joker', NULL, NULL, NULL),
(36, 3, 'joker', NULL, NULL, NULL),
(37, 2, 'joker', NULL, NULL, NULL),
(38, 6, 'Joker', NULL, NULL, NULL),
(39, 2, 'nick', NULL, NULL, NULL),
(40, 2, 'nick', NULL, NULL, NULL),
(41, 3, 'Renan', NULL, NULL, NULL),
(42, 3, 'Hu', NULL, NULL, NULL),
(43, 3, 'Hu', NULL, NULL, NULL),
(44, 3, 'Hu', '-23.6700596', '-46.4904001', NULL),
(45, 30, 'Folks', '-23.6700636', '-46.4904031', NULL),
(46, 30, 'StarFox', '-23.670060799999998', '-46.490403699999995', NULL),
(47, 30, 'Luna', '-23.6700488', '-46.490414', NULL),
(48, 31, 'RenanS', '-23.6700454', '-46.4904112', NULL),
(49, 31, 'NickM', '-23.6700405', '-46.4904096', NULL),
(50, 32, 'jk', '-23.670043399999997', '-46.4904095', NULL),
(51, 32, 'kiko', '-23.6700415', '-46.4904017', NULL),
(52, 33, 'tete123', '-23.6700543', '-46.4903054', NULL);

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
