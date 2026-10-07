CREATE TABLE `order_deliveries` (
	`order_id` text PRIMARY KEY NOT NULL,
	`courier` text DEFAULT '' NOT NULL,
	`tracking_number` text DEFAULT '' NOT NULL,
	`tracking_url` text DEFAULT '' NOT NULL,
	`incident` text DEFAULT '' NOT NULL,
	`reason` text DEFAULT '' NOT NULL,
	`revision` integer DEFAULT 1 NOT NULL,
	`updated_at` text NOT NULL,
	FOREIGN KEY (`order_id`) REFERENCES `orders`(`id`) ON UPDATE no action ON DELETE cascade
);
