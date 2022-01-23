import { Client } from "./Client";

export class Phone {
	id!: Number;
	brand!: String;
	model!: String;
	serial!: String;
	client!: Client;
}
