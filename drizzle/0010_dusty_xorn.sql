CREATE TABLE `ad_expenses` (
	`id` text PRIMARY KEY NOT NULL,
	`date` text NOT NULL,
	`currency` text NOT NULL,
	`amount_cents` integer NOT NULL,
	`note` text DEFAULT '' NOT NULL,
	`revision` integer DEFAULT 1 NOT NULL,
	`updated_at` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `order_costs` (
	`order_id` text PRIMARY KEY NOT NULL,
	`unit_cost_cents` integer NOT NULL,
	`delivery_cost_cents` integer NOT NULL,
	`return_cost_cents` integer NOT NULL,
	`loss_cents` integer NOT NULL,
	`revision` integer DEFAULT 1 NOT NULL,
	`updated_at` text NOT NULL,
	FOREIGN KEY (`order_id`) REFERENCES `orders`(`id`) ON UPDATE no action ON DELETE cascade
);
