import { Phone } from "./Phone";

export class Repair {
	id!: Number;
	phone!: Phone;
	failure!: String;
	notes!: String;
	status!: Number;
	dateIn!: Date;
	dateOut!: Date;
}
