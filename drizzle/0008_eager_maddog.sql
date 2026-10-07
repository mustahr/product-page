CREATE TABLE `order_confirmations` (
	`order_id` text PRIMARY KEY NOT NULL,
	`notes` text DEFAULT '' NOT NULL,
	`outcome` text DEFAULT '' NOT NULL,
	`follow_up_date` text DEFAULT '' NOT NULL,
	`revision` integer DEFAULT 1 NOT NULL,
	`updated_at` text NOT NULL,
	FOREIGN KEY (`order_id`) REFERENCES `orders`(`id`) ON UPDATE no action ON DELETE cascade
);
