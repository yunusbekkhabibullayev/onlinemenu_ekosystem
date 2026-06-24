-- phpMyAdmin SQL Dump
-- version 5.2.1-1.el8
-- https://www.phpmyadmin.net/
--
-- Хост: localhost
-- Время создания: Мар 07 2026 г., 06:30
-- Версия сервера: 10.6.24-MariaDB-cll-lve
-- Версия PHP: 7.2.24

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- База данных: `x_u_7660_online_menu_db`
--

-- --------------------------------------------------------

--
-- Структура таблицы `cache`
--

CREATE TABLE `cache` (
  `key` varchar(255) NOT NULL,
  `value` mediumtext NOT NULL,
  `expiration` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Структура таблицы `cache_locks`
--

CREATE TABLE `cache_locks` (
  `key` varchar(255) NOT NULL,
  `owner` varchar(255) NOT NULL,
  `expiration` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Структура таблицы `categories`
--

CREATE TABLE `categories` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `restaurant_id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `slug` varchar(255) DEFAULT NULL,
  `order` int(11) NOT NULL DEFAULT 0,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Дамп данных таблицы `categories`
--

INSERT INTO `categories` (`id`, `restaurant_id`, `name`, `slug`, `order`, `is_active`, `created_at`, `updated_at`) VALUES
(1, 1, 'Salatlar', NULL, 1, 1, '2026-01-28 10:52:23', '2026-01-28 10:52:23'),
(2, 1, 'Sho\'rvalar', NULL, 2, 1, '2026-01-28 10:52:23', '2026-01-28 10:52:23'),
(3, 1, 'Asosiy taomlar', NULL, 3, 1, '2026-01-28 10:52:23', '2026-01-28 10:52:23'),
(4, 1, 'Kaboblar', NULL, 4, 1, '2026-01-28 10:52:23', '2026-01-28 10:52:23'),
(5, 1, 'Ichimliklar', NULL, 5, 1, '2026-01-28 10:52:24', '2026-01-28 10:52:24'),
(6, 1, 'Shirinliklar', NULL, 6, 1, '2026-01-28 10:52:24', '2026-01-28 10:52:24');

-- --------------------------------------------------------

--
-- Структура таблицы `failed_jobs`
--

CREATE TABLE `failed_jobs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `uuid` varchar(255) NOT NULL,
  `connection` text NOT NULL,
  `queue` text NOT NULL,
  `payload` longtext NOT NULL,
  `exception` longtext NOT NULL,
  `failed_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Структура таблицы `food_items`
--

CREATE TABLE `food_items` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `category_id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `price` decimal(10,2) NOT NULL DEFAULT 0.00,
  `image` varchar(255) DEFAULT NULL,
  `is_available` tinyint(1) NOT NULL DEFAULT 1,
  `order` int(11) NOT NULL DEFAULT 0,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Дамп данных таблицы `food_items`
--

INSERT INTO `food_items` (`id`, `category_id`, `name`, `description`, `price`, `image`, `is_available`, `order`, `created_at`, `updated_at`) VALUES
(1, 1, 'Sezar salati', 'Tovuq go\'shti, parmezn, krutonar', 35000.00, 'foods/eQ1BiFKDYQr8M7OTth7vyv1XYATE8pDKNdaiDzH5.jpg', 1, 0, '2026-01-28 10:52:24', '2026-01-29 07:17:24'),
(2, 1, 'Olivye', 'An\'anaviy rus salati', 28000.00, 'foods/S9jFsYWBLmbeKJdY0Xi6fWa2bEVHb1thYXUDvh3n.png', 1, 0, '2026-01-28 10:52:25', '2026-03-04 19:04:24'),
(3, 1, 'Yunoncha salat', 'Pomidor, bodring, zaytun', 32000.00, NULL, 1, 0, '2026-01-28 10:52:25', '2026-01-28 10:52:25'),
(4, 2, 'Mastava', 'Go\'shtli guruch sho\'rvasi', 25000.00, NULL, 1, 0, '2026-01-28 10:52:26', '2026-01-28 10:52:26'),
(5, 2, 'Lag\'mon sho\'rvasi', 'Uyg\'urcha lag\'mon', 30000.00, NULL, 1, 0, '2026-01-28 10:52:26', '2026-01-28 10:52:26'),
(6, 2, 'Shurpa', 'Qo\'y go\'shtidan tayyorlangan', 35000.00, NULL, 1, 0, '2026-01-28 10:52:26', '2026-01-28 10:52:26'),
(7, 3, 'Palov', 'Toshkent palovi', 40000.00, NULL, 1, 0, '2026-01-28 10:52:27', '2026-01-28 10:52:27'),
(8, 3, 'Lag\'mon', 'Qo\'l lag\'moni', 35000.00, NULL, 1, 0, '2026-01-28 10:52:27', '2026-01-28 10:52:27'),
(9, 3, 'Manti', '5 dona', 30000.00, NULL, 1, 0, '2026-01-28 10:52:28', '2026-01-28 10:52:28'),
(10, 3, 'Chuchvara', 'Qaymoq bilan', 28000.00, NULL, 1, 0, '2026-01-28 10:52:28', '2026-01-28 10:52:28'),
(11, 4, 'Qo\'y kabob', '100g', 45000.00, NULL, 1, 0, '2026-01-28 10:52:28', '2026-01-28 10:52:28'),
(12, 4, 'Tovuq kabob', '100g', 30000.00, NULL, 1, 0, '2026-01-28 10:52:29', '2026-01-28 10:52:29'),
(13, 4, 'Jigar kabob', '100g', 25000.00, NULL, 1, 0, '2026-01-28 10:52:29', '2026-01-28 10:52:29'),
(14, 4, 'Lyulya kabob', '100g', 35000.00, NULL, 1, 0, '2026-01-28 10:52:30', '2026-01-28 10:52:30'),
(15, 5, 'Kompot', 'Uy tayyorlovi', 10000.00, NULL, 1, 0, '2026-01-28 10:52:30', '2026-01-28 10:52:30'),
(16, 5, 'Limonad', 'Yangi tayyorlangan', 15000.00, NULL, 1, 0, '2026-01-28 10:52:30', '2026-01-28 10:52:30'),
(17, 5, 'Choy', 'Qora yoki ko\'k', 8000.00, NULL, 1, 0, '2026-01-28 10:52:31', '2026-01-28 10:52:31'),
(18, 5, 'Ayran', '0.5L', 12000.00, NULL, 1, 0, '2026-01-28 10:52:31', '2026-01-28 10:52:31'),
(19, 6, 'Medovik', 'Asalli tort', 25000.00, NULL, 1, 0, '2026-01-28 10:52:32', '2026-01-28 10:52:32'),
(20, 6, 'Tiramisu', 'Italyan shirinligi', 30000.00, NULL, 1, 0, '2026-01-28 10:52:32', '2026-01-28 10:52:32'),
(21, 6, 'Baklava', 'Turk shirrinligi', 20000.00, NULL, 1, 0, '2026-01-28 10:52:33', '2026-01-28 10:52:33'),
(22, 1, 'Sezar salati', 'Tovuq go\'shti, parmezn, krutonar', 35000.00, NULL, 1, 0, '2026-02-27 12:14:15', '2026-02-27 12:14:15'),
(23, 1, 'Olivye', 'An\'anaviy rus salati', 28000.00, NULL, 1, 0, '2026-02-27 12:14:16', '2026-02-27 12:14:16'),
(24, 1, 'Yunoncha salat', 'Pomidor, bodring, zaytun', 32000.00, NULL, 1, 0, '2026-02-27 12:14:16', '2026-02-27 12:14:16'),
(25, 2, 'Mastava', 'Go\'shtli guruch sho\'rvasi', 25000.00, NULL, 1, 0, '2026-02-27 12:14:17', '2026-02-27 12:14:17'),
(26, 2, 'Lag\'mon sho\'rvasi', 'Uyg\'urcha lag\'mon', 30000.00, NULL, 1, 0, '2026-02-27 12:14:17', '2026-02-27 12:14:17'),
(27, 2, 'Shurpa', 'Qo\'y go\'shtidan tayyorlangan', 35000.00, NULL, 1, 0, '2026-02-27 12:14:17', '2026-02-27 12:14:17'),
(28, 3, 'Palov', 'Toshkent palovi', 40000.00, NULL, 1, 0, '2026-02-27 12:14:18', '2026-02-27 12:14:18'),
(29, 3, 'Lag\'mon', 'Qo\'l lag\'moni', 35000.00, NULL, 1, 0, '2026-02-27 12:14:18', '2026-02-27 12:14:18'),
(30, 3, 'Manti', '5 dona', 30000.00, NULL, 1, 0, '2026-02-27 12:14:19', '2026-02-27 12:14:19'),
(31, 3, 'Chuchvara', 'Qaymoq bilan', 28000.00, NULL, 1, 0, '2026-02-27 12:14:19', '2026-02-27 12:14:19'),
(32, 4, 'Qo\'y kabob', '100g', 45000.00, NULL, 1, 0, '2026-02-27 12:14:19', '2026-02-27 12:14:19'),
(33, 4, 'Tovuq kabob', '100g', 30000.00, NULL, 1, 0, '2026-02-27 12:14:20', '2026-02-27 12:14:20'),
(34, 4, 'Jigar kabob', '100g', 25000.00, NULL, 1, 0, '2026-02-27 12:14:20', '2026-02-27 12:14:20'),
(35, 4, 'Lyulya kabob', '100g', 35000.00, NULL, 1, 0, '2026-02-27 12:14:21', '2026-02-27 12:14:21'),
(36, 5, 'Kompot', 'Uy tayyorlovi', 10000.00, NULL, 1, 0, '2026-02-27 12:14:21', '2026-02-27 12:14:21'),
(37, 5, 'Limonad', 'Yangi tayyorlangan', 15000.00, NULL, 1, 0, '2026-02-27 12:14:21', '2026-02-27 12:14:21'),
(38, 5, 'Choy', 'Qora yoki ko\'k', 8000.00, NULL, 1, 0, '2026-02-27 12:14:22', '2026-02-27 12:14:22'),
(39, 5, 'Ayran', '0.5L', 12000.00, NULL, 1, 0, '2026-02-27 12:14:22', '2026-02-27 12:14:22'),
(40, 6, 'Medovik', 'Asalli tort', 25000.00, NULL, 1, 0, '2026-02-27 12:14:23', '2026-02-27 12:14:23'),
(41, 6, 'Tiramisu', 'Italyan shirinligi', 30000.00, NULL, 1, 0, '2026-02-27 12:14:23', '2026-02-27 12:14:23'),
(42, 6, 'Baklava', 'Turk shirrinligi', 20000.00, NULL, 1, 0, '2026-02-27 12:14:23', '2026-02-27 12:14:23');

-- --------------------------------------------------------

--
-- Структура таблицы `jobs`
--

CREATE TABLE `jobs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `queue` varchar(255) NOT NULL,
  `payload` longtext NOT NULL,
  `attempts` tinyint(3) UNSIGNED NOT NULL,
  `reserved_at` int(10) UNSIGNED DEFAULT NULL,
  `available_at` int(10) UNSIGNED NOT NULL,
  `created_at` int(10) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Структура таблицы `job_batches`
--

CREATE TABLE `job_batches` (
  `id` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `total_jobs` int(11) NOT NULL,
  `pending_jobs` int(11) NOT NULL,
  `failed_jobs` int(11) NOT NULL,
  `failed_job_ids` longtext NOT NULL,
  `options` mediumtext DEFAULT NULL,
  `cancelled_at` int(11) DEFAULT NULL,
  `created_at` int(11) NOT NULL,
  `finished_at` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Структура таблицы `migrations`
--

CREATE TABLE `migrations` (
  `id` int(10) UNSIGNED NOT NULL,
  `migration` varchar(255) NOT NULL,
  `batch` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Дамп данных таблицы `migrations`
--

INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES
(1, '0001_01_01_000000_create_users_table', 1),
(2, '0001_01_01_000001_create_cache_table', 1),
(3, '0001_01_01_000002_create_jobs_table', 1),
(4, '2026_01_28_081837_create_restaurants_table', 1),
(5, '2026_01_28_081838_create_categories_table', 1),
(6, '2026_01_28_081838_create_food_items_table', 1),
(7, '2026_01_28_081839_create_orders_table', 1),
(8, '2026_01_28_081840_create_order_items_table', 1),
(9, '2026_01_28_091057_add_role_to_users_table', 1),
(10, '2026_01_28_155718_add_telegram_fields_to_users_table', 2),
(11, '2026_02_27_151436_create_tables_table', 3),
(12, '2026_02_27_151440_create_order_sessions_table', 3),
(13, '2026_02_27_151442_create_payments_table', 3),
(14, '2026_02_27_151444_add_table_fields_to_orders_table', 3),
(15, '2026_02_27_151446_add_role_fields_to_users_table', 3),
(16, '2026_03_01_175600_add_performance_indexes', 4),
(17, '2026_03_07_062916_add_username_to_users_table', 5);

-- --------------------------------------------------------

--
-- Структура таблицы `orders`
--

CREATE TABLE `orders` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `restaurant_id` bigint(20) UNSIGNED NOT NULL,
  `table_id` bigint(20) UNSIGNED DEFAULT NULL,
  `order_session_id` bigint(20) UNSIGNED DEFAULT NULL,
  `waiter_id` bigint(20) UNSIGNED DEFAULT NULL,
  `order_number` varchar(255) NOT NULL,
  `phone` varchar(255) NOT NULL,
  `customer_name` varchar(255) DEFAULT NULL,
  `total_amount` decimal(10,2) NOT NULL DEFAULT 0.00,
  `delivery_price` decimal(10,2) NOT NULL DEFAULT 0.00,
  `status` enum('pending','confirmed','preparing','ready','delivered','paid','cancelled') NOT NULL DEFAULT 'pending',
  `payment_status` enum('unpaid','partial','paid') NOT NULL DEFAULT 'unpaid',
  `payment_method` enum('cash','card','online') DEFAULT NULL,
  `paid_at` timestamp NULL DEFAULT NULL,
  `ready_at` timestamp NULL DEFAULT NULL,
  `delivered_at` timestamp NULL DEFAULT NULL,
  `is_additional` tinyint(1) NOT NULL DEFAULT 0,
  `parent_order_id` bigint(20) UNSIGNED DEFAULT NULL,
  `notes` text DEFAULT NULL,
  `telegram_message_id` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Дамп данных таблицы `orders`
--

INSERT INTO `orders` (`id`, `restaurant_id`, `table_id`, `order_session_id`, `waiter_id`, `order_number`, `phone`, `customer_name`, `total_amount`, `delivery_price`, `status`, `payment_status`, `payment_method`, `paid_at`, `ready_at`, `delivered_at`, `is_additional`, `parent_order_id`, `notes`, `telegram_message_id`, `created_at`, `updated_at`) VALUES
(1, 1, NULL, NULL, NULL, 'ORD-69A16D452F7C0', '+998913731196', NULL, 35000.00, 7000.00, 'delivered', 'unpaid', NULL, NULL, NULL, NULL, 0, NULL, NULL, '47', '2026-02-27 10:09:09', '2026-02-27 10:26:41'),
(2, 1, NULL, NULL, NULL, 'ORD-69A4448885706', '+998994161100', NULL, 55000.00, 7000.00, 'confirmed', 'unpaid', NULL, NULL, NULL, NULL, 0, NULL, NULL, '55', '2026-03-01 13:52:08', '2026-03-01 13:55:15'),
(3, 1, NULL, NULL, NULL, 'ORD-69A445B2AB9E8', '+998901234567', NULL, 191000.00, 7000.00, 'pending', 'unpaid', NULL, NULL, NULL, NULL, 0, NULL, NULL, '57', '2026-03-01 13:57:06', '2026-03-01 13:58:01'),
(4, 1, NULL, NULL, NULL, 'ORD-69A46BE13A54B', '+998335552171', NULL, 105000.00, 7000.00, 'delivered', 'unpaid', NULL, NULL, NULL, NULL, 0, NULL, NULL, '68', '2026-03-01 16:40:01', '2026-03-01 16:42:05'),
(5, 1, NULL, NULL, NULL, 'ORD-69A6A41A3C75D', '+998335554441', NULL, 70000.00, 7000.00, 'delivered', 'unpaid', NULL, NULL, NULL, NULL, 0, NULL, NULL, '70', '2026-03-03 09:04:26', '2026-03-03 09:05:16'),
(6, 1, NULL, NULL, NULL, 'ORD-69A6B359BEB0E', '+998995558880', NULL, 196000.00, 7000.00, 'preparing', 'unpaid', NULL, NULL, NULL, NULL, 0, NULL, NULL, '72', '2026-03-03 10:09:29', '2026-03-03 10:09:52'),
(7, 1, NULL, NULL, NULL, 'ORD-69A6CAE84D44F', '+998994455522', NULL, 95000.00, 7000.00, 'preparing', 'unpaid', NULL, NULL, NULL, NULL, 0, NULL, NULL, '74', '2026-03-03 11:50:00', '2026-03-03 11:50:16');

-- --------------------------------------------------------

--
-- Структура таблицы `order_items`
--

CREATE TABLE `order_items` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `order_id` bigint(20) UNSIGNED NOT NULL,
  `food_item_id` bigint(20) UNSIGNED NOT NULL,
  `quantity` int(11) NOT NULL DEFAULT 1,
  `price` decimal(10,2) NOT NULL DEFAULT 0.00,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Дамп данных таблицы `order_items`
--

INSERT INTO `order_items` (`id`, `order_id`, `food_item_id`, `quantity`, `price`, `created_at`, `updated_at`) VALUES
(1, 1, 1, 1, 35000.00, '2026-02-27 10:09:09', '2026-02-27 10:09:09'),
(2, 2, 4, 1, 25000.00, '2026-03-01 13:52:08', '2026-03-01 13:52:08'),
(3, 2, 5, 1, 30000.00, '2026-03-01 13:52:08', '2026-03-01 13:52:08'),
(4, 3, 9, 1, 30000.00, '2026-03-01 13:57:06', '2026-03-01 13:57:06'),
(5, 3, 10, 1, 28000.00, '2026-03-01 13:57:06', '2026-03-01 13:57:06'),
(6, 3, 29, 1, 35000.00, '2026-03-01 13:57:06', '2026-03-01 13:57:06'),
(7, 3, 28, 1, 40000.00, '2026-03-01 13:57:06', '2026-03-01 13:57:06'),
(8, 3, 30, 1, 30000.00, '2026-03-01 13:57:06', '2026-03-01 13:57:06'),
(9, 3, 31, 1, 28000.00, '2026-03-01 13:57:06', '2026-03-01 13:57:06'),
(10, 4, 1, 3, 35000.00, '2026-03-01 16:40:01', '2026-03-01 16:40:01'),
(11, 5, 1, 2, 35000.00, '2026-03-03 09:04:26', '2026-03-03 09:04:26'),
(12, 6, 1, 4, 35000.00, '2026-03-03 10:09:29', '2026-03-03 10:09:29'),
(13, 6, 2, 2, 28000.00, '2026-03-03 10:09:29', '2026-03-03 10:09:29'),
(14, 7, 1, 1, 35000.00, '2026-03-03 11:50:00', '2026-03-03 11:50:00'),
(15, 7, 2, 1, 28000.00, '2026-03-03 11:50:00', '2026-03-03 11:50:00'),
(16, 7, 3, 1, 32000.00, '2026-03-03 11:50:00', '2026-03-03 11:50:00');

-- --------------------------------------------------------

--
-- Структура таблицы `order_sessions`
--

CREATE TABLE `order_sessions` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `table_id` bigint(20) UNSIGNED NOT NULL,
  `waiter_id` bigint(20) UNSIGNED DEFAULT NULL,
  `status` enum('active','closed','paid') NOT NULL DEFAULT 'active',
  `started_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `closed_at` timestamp NULL DEFAULT NULL,
  `total_amount` decimal(10,2) NOT NULL DEFAULT 0.00,
  `paid_amount` decimal(10,2) NOT NULL DEFAULT 0.00,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Структура таблицы `password_reset_tokens`
--

CREATE TABLE `password_reset_tokens` (
  `email` varchar(255) NOT NULL,
  `token` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Структура таблицы `payments`
--

CREATE TABLE `payments` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `order_id` bigint(20) UNSIGNED DEFAULT NULL,
  `order_session_id` bigint(20) UNSIGNED DEFAULT NULL,
  `amount` decimal(10,2) NOT NULL,
  `payment_method` enum('cash','card','online') NOT NULL DEFAULT 'cash',
  `status` enum('pending','completed','refunded') NOT NULL DEFAULT 'pending',
  `processed_by` bigint(20) UNSIGNED DEFAULT NULL,
  `notes` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Структура таблицы `restaurants`
--

CREATE TABLE `restaurants` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `phone` varchar(255) DEFAULT NULL,
  `working_hours` varchar(255) DEFAULT NULL,
  `logo` varchar(255) DEFAULT NULL,
  `location_url` varchar(255) DEFAULT NULL,
  `instagram` varchar(255) DEFAULT NULL,
  `telegram` varchar(255) DEFAULT NULL,
  `delivery_price` decimal(10,2) NOT NULL DEFAULT 0.00,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Дамп данных таблицы `restaurants`
--

INSERT INTO `restaurants` (`id`, `name`, `description`, `address`, `phone`, `working_hours`, `logo`, `location_url`, `instagram`, `telegram`, `delivery_price`, `is_active`, `created_at`, `updated_at`) VALUES
(1, 'Shaverlent', 'Shaver lent - oila do\'stlar davrasi uchun qulay joy', 'Jizzax viloyati Do\'stlik tumani Park', '+998 87 087 97 11', '09:00 - 22:00', 'restaurants/2KYVknYMovJ1utFYPI2XRn2uOpJpOdXheFKLW6Cy.png', 'https://maps.app.goo.gl/vGoC3SooFWnaa8eZ6', 'https://www.instagram.com/shaver_lent/', 'https://t.me/shaver_lent', 6000.00, 1, '2026-01-28 10:52:23', '2026-03-04 19:02:18');

-- --------------------------------------------------------

--
-- Структура таблицы `sessions`
--

CREATE TABLE `sessions` (
  `id` varchar(255) NOT NULL,
  `user_id` bigint(20) UNSIGNED DEFAULT NULL,
  `ip_address` varchar(45) DEFAULT NULL,
  `user_agent` text DEFAULT NULL,
  `payload` longtext NOT NULL,
  `last_activity` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Структура таблицы `tables`
--

CREATE TABLE `tables` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `restaurant_id` bigint(20) UNSIGNED NOT NULL,
  `number` varchar(255) NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `capacity` int(11) NOT NULL DEFAULT 4,
  `status` enum('available','occupied','reserved','cleaning') NOT NULL DEFAULT 'available',
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Дамп данных таблицы `tables`
--

INSERT INTO `tables` (`id`, `restaurant_id`, `number`, `name`, `capacity`, `status`, `is_active`, `created_at`, `updated_at`) VALUES
(1, 1, '1', 'Oyna yonida', 4, 'available', 1, '2026-02-27 10:35:09', '2026-02-27 10:35:09'),
(2, 1, '2', NULL, 4, 'available', 1, '2026-02-27 10:35:09', '2026-02-27 10:35:09'),
(3, 1, '3', NULL, 6, 'available', 1, '2026-02-27 10:35:09', '2026-02-27 10:35:09'),
(4, 1, '4', 'Balkon', 4, 'available', 1, '2026-02-27 10:35:09', '2026-02-27 10:35:09'),
(5, 1, '5', NULL, 2, 'available', 1, '2026-02-27 10:35:10', '2026-02-27 10:35:10'),
(6, 1, '6', NULL, 8, 'available', 1, '2026-02-27 10:35:10', '2026-02-27 10:35:10'),
(7, 1, '7', NULL, 4, 'available', 1, '2026-02-27 10:35:10', '2026-02-27 10:35:10'),
(8, 1, '8', NULL, 6, 'available', 1, '2026-02-27 10:35:10', '2026-02-27 10:35:10'),
(9, 1, 'VIP-1', 'VIP xona', 10, 'available', 1, '2026-02-27 10:35:10', '2026-02-27 10:35:10'),
(10, 1, 'VIP-2', 'VIP xona', 12, 'available', 1, '2026-02-27 10:35:11', '2026-02-27 10:35:11');

-- --------------------------------------------------------

--
-- Структура таблицы `users`
--

CREATE TABLE `users` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `telegram_id` varchar(255) DEFAULT NULL,
  `telegram_username` varchar(255) DEFAULT NULL,
  `telegram_first_name` varchar(255) DEFAULT NULL,
  `telegram_last_name` varchar(255) DEFAULT NULL,
  `telegram_photo_url` varchar(255) DEFAULT NULL,
  `telegram_auth_date` varchar(255) DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `username` varchar(255) DEFAULT NULL,
  `role` enum('admin','waiter','kitchen','cashier','user') NOT NULL DEFAULT 'user',
  `employee_code` varchar(255) DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `remember_token` varchar(100) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Дамп данных таблицы `users`
--

INSERT INTO `users` (`id`, `telegram_id`, `telegram_username`, `telegram_first_name`, `telegram_last_name`, `telegram_photo_url`, `telegram_auth_date`, `name`, `email`, `username`, `role`, `employee_code`, `is_active`, `email_verified_at`, `password`, `remember_token`, `created_at`, `updated_at`) VALUES
(1, NULL, NULL, NULL, NULL, NULL, NULL, 'Admin', 'admin@example.com', 'admin', 'admin', 'ADM001', 1, '2026-01-28 10:52:22', '$2y$12$Sj9Tp.fs0eGOYN9KUD2xyemIXwawbrmkf2TXja9StrlBUAe49yX.a', 'meBODf2ZOyRjyxM2zmIhlualjf5w9uXiApixXmFGJBrGGDdDiAYuxjwIYqId', '2026-01-28 10:52:22', '2026-03-07 01:30:11'),
(2, '848664243', 'xabibullayevyunusbek', 'Khabibullayev', 'Yunusbek', 'https://t.me/i/userpic/320/35hAOktCl3Gh0EUIt3EuMusfmPtw0cMMFdsBDNsbeuBze-7E4sytH9MA-sLJXv5x.svg', '1772374656', 'Khabibullayev', 'tg_5143631539@telegram.local', NULL, 'user', NULL, 1, NULL, NULL, NULL, '2026-01-28 11:08:31', '2026-03-01 14:17:36'),
(3, '538108243', 'urinboydev', 'UrinboyDev.uz', '- TURSUNBOYEV URINBOY', NULL, '1769598855', 'UrinboyDev.uz', 'tg_538108243@telegram.local', NULL, 'user', NULL, 1, NULL, NULL, NULL, '2026-01-28 11:09:39', '2026-01-28 11:14:15'),
(4, NULL, NULL, NULL, NULL, NULL, NULL, 'Ali Valiyev', 'waiter1@example.com', 'waiter1', 'waiter', 'W001', 1, NULL, '$2y$12$qBGve7E2ukKC7aD9bNA4BOVOcTVNxgLtYBqt7IZ0XV9gjgVWOTtRO', NULL, '2026-02-27 10:35:17', '2026-03-07 01:30:11'),
(5, NULL, NULL, NULL, NULL, NULL, NULL, 'Hasan Karimov', 'waiter2@example.com', 'waiter2', 'waiter', 'W002', 1, NULL, '$2y$12$79dAW4eynaqLLRX.iJqJz.ykTr523geXuFONxaa5P5HGgM8mOY68C', NULL, '2026-02-27 10:35:18', '2026-03-07 01:30:12'),
(6, NULL, NULL, NULL, NULL, NULL, NULL, 'Oshpaz 1', 'kitchen1@example.com', 'oshpaz1', 'kitchen', 'K001', 1, NULL, '$2y$12$KfxxbEkJQd6XZ3WGm8.V1./n30d4Q4mZ.bTr1mxMrv25dJ7P7Vsey', NULL, '2026-02-27 10:35:18', '2026-03-07 01:30:13'),
(7, NULL, NULL, NULL, NULL, NULL, NULL, 'Oshpaz 2', 'kitchen2@example.com', 'oshpaz2', 'kitchen', 'K002', 1, NULL, '$2y$12$L7snh22pNTrdfexnhCOEFe0k6rSoOyosctcu11mSs3meXvSOcrE8q', NULL, '2026-02-27 10:35:19', '2026-03-07 01:30:13'),
(8, NULL, NULL, NULL, NULL, NULL, NULL, 'Kassa 1', 'cashier1@example.com', 'kassa1', 'cashier', 'C001', 1, NULL, '$2y$12$/AnNYuBy08sYfjrRIn8Ig.Cr6PLfuat7yKVKMjXLJ0mdkd3emqLsW', NULL, '2026-02-27 10:35:20', '2026-03-07 01:30:14');

--
-- Индексы сохранённых таблиц
--

--
-- Индексы таблицы `cache`
--
ALTER TABLE `cache`
  ADD PRIMARY KEY (`key`),
  ADD KEY `cache_expiration_index` (`expiration`);

--
-- Индексы таблицы `cache_locks`
--
ALTER TABLE `cache_locks`
  ADD PRIMARY KEY (`key`),
  ADD KEY `cache_locks_expiration_index` (`expiration`);

--
-- Индексы таблицы `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`id`),
  ADD KEY `categories_restaurant_id_foreign` (`restaurant_id`),
  ADD KEY `categories_is_active_idx` (`is_active`),
  ADD KEY `categories_order_idx` (`order`),
  ADD KEY `categories_active_restaurant_order_idx` (`is_active`,`restaurant_id`,`order`);

--
-- Индексы таблицы `failed_jobs`
--
ALTER TABLE `failed_jobs`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `failed_jobs_uuid_unique` (`uuid`);

--
-- Индексы таблицы `food_items`
--
ALTER TABLE `food_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `food_items_category_id_foreign` (`category_id`),
  ADD KEY `food_items_is_available_idx` (`is_available`),
  ADD KEY `food_items_order_idx` (`order`),
  ADD KEY `food_items_available_category_order_idx` (`is_available`,`category_id`,`order`);

--
-- Индексы таблицы `jobs`
--
ALTER TABLE `jobs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `jobs_queue_index` (`queue`);

--
-- Индексы таблицы `job_batches`
--
ALTER TABLE `job_batches`
  ADD PRIMARY KEY (`id`);

--
-- Индексы таблицы `migrations`
--
ALTER TABLE `migrations`
  ADD PRIMARY KEY (`id`);

--
-- Индексы таблицы `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `orders_order_number_unique` (`order_number`),
  ADD KEY `orders_restaurant_id_foreign` (`restaurant_id`),
  ADD KEY `orders_table_id_foreign` (`table_id`),
  ADD KEY `orders_order_session_id_foreign` (`order_session_id`),
  ADD KEY `orders_waiter_id_foreign` (`waiter_id`),
  ADD KEY `orders_parent_order_id_foreign` (`parent_order_id`);

--
-- Индексы таблицы `order_items`
--
ALTER TABLE `order_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `order_items_order_id_foreign` (`order_id`),
  ADD KEY `order_items_food_item_id_foreign` (`food_item_id`);

--
-- Индексы таблицы `order_sessions`
--
ALTER TABLE `order_sessions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `order_sessions_table_id_foreign` (`table_id`),
  ADD KEY `order_sessions_waiter_id_foreign` (`waiter_id`);

--
-- Индексы таблицы `password_reset_tokens`
--
ALTER TABLE `password_reset_tokens`
  ADD PRIMARY KEY (`email`);

--
-- Индексы таблицы `payments`
--
ALTER TABLE `payments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `payments_order_id_foreign` (`order_id`),
  ADD KEY `payments_order_session_id_foreign` (`order_session_id`),
  ADD KEY `payments_processed_by_foreign` (`processed_by`);

--
-- Индексы таблицы `restaurants`
--
ALTER TABLE `restaurants`
  ADD PRIMARY KEY (`id`),
  ADD KEY `restaurants_is_active_idx` (`is_active`);

--
-- Индексы таблицы `sessions`
--
ALTER TABLE `sessions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `sessions_user_id_index` (`user_id`),
  ADD KEY `sessions_last_activity_index` (`last_activity`);

--
-- Индексы таблицы `tables`
--
ALTER TABLE `tables`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `tables_restaurant_id_number_unique` (`restaurant_id`,`number`);

--
-- Индексы таблицы `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `users_email_unique` (`email`),
  ADD UNIQUE KEY `users_telegram_id_unique` (`telegram_id`),
  ADD UNIQUE KEY `users_username_unique` (`username`);

--
-- AUTO_INCREMENT для сохранённых таблиц
--

--
-- AUTO_INCREMENT для таблицы `categories`
--
ALTER TABLE `categories`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT для таблицы `failed_jobs`
--
ALTER TABLE `failed_jobs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT для таблицы `food_items`
--
ALTER TABLE `food_items`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=44;

--
-- AUTO_INCREMENT для таблицы `jobs`
--
ALTER TABLE `jobs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT для таблицы `migrations`
--
ALTER TABLE `migrations`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT для таблицы `orders`
--
ALTER TABLE `orders`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT для таблицы `order_items`
--
ALTER TABLE `order_items`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT для таблицы `order_sessions`
--
ALTER TABLE `order_sessions`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT для таблицы `payments`
--
ALTER TABLE `payments`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT для таблицы `restaurants`
--
ALTER TABLE `restaurants`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT для таблицы `tables`
--
ALTER TABLE `tables`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT для таблицы `users`
--
ALTER TABLE `users`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- Ограничения внешнего ключа сохраненных таблиц
--

--
-- Ограничения внешнего ключа таблицы `categories`
--
ALTER TABLE `categories`
  ADD CONSTRAINT `categories_restaurant_id_foreign` FOREIGN KEY (`restaurant_id`) REFERENCES `restaurants` (`id`) ON DELETE CASCADE;

--
-- Ограничения внешнего ключа таблицы `food_items`
--
ALTER TABLE `food_items`
  ADD CONSTRAINT `food_items_category_id_foreign` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE CASCADE;

--
-- Ограничения внешнего ключа таблицы `orders`
--
ALTER TABLE `orders`
  ADD CONSTRAINT `orders_order_session_id_foreign` FOREIGN KEY (`order_session_id`) REFERENCES `order_sessions` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `orders_parent_order_id_foreign` FOREIGN KEY (`parent_order_id`) REFERENCES `orders` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `orders_restaurant_id_foreign` FOREIGN KEY (`restaurant_id`) REFERENCES `restaurants` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `orders_table_id_foreign` FOREIGN KEY (`table_id`) REFERENCES `tables` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `orders_waiter_id_foreign` FOREIGN KEY (`waiter_id`) REFERENCES `users` (`id`) ON DELETE SET NULL;

--
-- Ограничения внешнего ключа таблицы `order_items`
--
ALTER TABLE `order_items`
  ADD CONSTRAINT `order_items_food_item_id_foreign` FOREIGN KEY (`food_item_id`) REFERENCES `food_items` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `order_items_order_id_foreign` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE;

--
-- Ограничения внешнего ключа таблицы `order_sessions`
--
ALTER TABLE `order_sessions`
  ADD CONSTRAINT `order_sessions_table_id_foreign` FOREIGN KEY (`table_id`) REFERENCES `tables` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `order_sessions_waiter_id_foreign` FOREIGN KEY (`waiter_id`) REFERENCES `users` (`id`) ON DELETE SET NULL;

--
-- Ограничения внешнего ключа таблицы `payments`
--
ALTER TABLE `payments`
  ADD CONSTRAINT `payments_order_id_foreign` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `payments_order_session_id_foreign` FOREIGN KEY (`order_session_id`) REFERENCES `order_sessions` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `payments_processed_by_foreign` FOREIGN KEY (`processed_by`) REFERENCES `users` (`id`) ON DELETE SET NULL;

--
-- Ограничения внешнего ключа таблицы `tables`
--
ALTER TABLE `tables`
  ADD CONSTRAINT `tables_restaurant_id_foreign` FOREIGN KEY (`restaurant_id`) REFERENCES `restaurants` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
