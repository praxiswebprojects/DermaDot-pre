CREATE TABLE `contact_rate_limits` (
	`visitor_key` text PRIMARY KEY NOT NULL,
	`window_started_at` integer NOT NULL,
	`submission_count` integer NOT NULL
);
