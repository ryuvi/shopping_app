CREATE TABLE `despensa` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`quantity` integer NOT NULL,
	`peso` real NOT NULL,
	`category` text NOT NULL,
	`aberto` integer DEFAULT 0 NOT NULL,
	`criado_em` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `itens` (
	`id` text PRIMARY KEY NOT NULL,
	`nome` text NOT NULL,
	`quantidade` integer NOT NULL,
	`preco` real NOT NULL,
	`peso` real NOT NULL,
	`categoria` text NOT NULL,
	`promocao` integer DEFAULT 0 NOT NULL,
	`criado_em` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `lista_itens` (
	`lista_id` text NOT NULL,
	`item_id` text NOT NULL,
	PRIMARY KEY(`lista_id`, `item_id`),
	FOREIGN KEY (`lista_id`) REFERENCES `listas`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`item_id`) REFERENCES `itens`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `listas` (
	`id` text PRIMARY KEY NOT NULL,
	`nome` text NOT NULL,
	`criada_em` text NOT NULL
);
