const express = require("express");
const conn = require("../connection");
const router = express.Router();

var auth = require("../services/authentication");
var chrole = require("../services/checkRole");

router.get("/", auth.authenticateToken, (req, res) => {
	sql = `SELECT r.repair_id AS id, r.failure, r.notes, r.date_in AS dateIn, r.date_repair AS dateOut, r.status,
			p.phone_id, p.brand, p.model, p.serial,
			c.client_id, c.idnumber, c.fullname, c.phonenumber, c.address
		FROM clients_phones_repairs r 
		INNER JOIN clients_phones p ON p.phone_id = r.phone_id 
		INNER JOIN clients c ON c.client_id = p.client_id ORDER BY r.date_in DESC`;

	conn.query(sql, (err, result) => {
		if (!err) {
			if (result.length > 0) {
				let rows = [];
				result.forEach(element => {
					rows.push({
						id: element.id,
						phone: {
							id: element.phone_id,
							client: {
								id: element.client_id,
								idnumber: element.idnumber,
								fullname: element.fullname,
								address: element.address,
								phoneNumber: element.phoneNumber
							},
							brand: element.brand,
							model: element.model,
							serial: element.serial
						},
						failure: element.failure,
						notes: element.notes,
						dateIn: element.dateIn,
						dateOut: element.dateOut,
						status: element.status,
					})
				});

				return res.status(200).json(rows);
			} else {
				return res.status(404).json({
					message: `No se han encontrado registros`
				});
			}
		} else {
			return res.status(500).json({ message: "Runtime Error: 6001", error: err });
		}
	});
});

router.get("/:id", auth.authenticateToken, (req, res) => {
	const { id } = req.params;

	sql = `SELECT r.repair_id AS id, r.failure, r.notes, r.date_in AS dateIn, r.date_repair AS dateOut, r.status,
			p.phone_id, p.brand, p.model, p.serial,
			c.client_id, c.idnumber, c.fullname, c.phonenumber, c.address
		FROM clients_phones_repairs r 
		INNER JOIN clients_phones p ON p.phone_id = r.phone_id 
		INNER JOIN clients c ON c.client_id = p.client_id WHERE r.repair_id = ?`;

	conn.query(sql, [id], (err, result) => {
		if (!err) {
			if (result.length > 0) {
				let rows = [];
				result.forEach(element => {
					rows.push({
						id: element.id,
						phone: {
							id: element.phone_id,
							client: {
								id: element.client_id,
								idnumber: element.idnumber,
								fullname: element.fullname,
								address: element.address,
								phoneNumber: element.phoneNumber
							},
							brand: element.brand,
							model: element.model,
							serial: element.serial
						},
						failure: element.failure,
						notes: element.notes,
						dateIn: element.dateIn,
						dateOut: element.dateOut,
						status: element.status,
					})
				});

				return res.status(200).json(rows);
			} else {
				return res.status(404).json({
					message: `No se han encontrado registros`
				});
			}
		} else {
			return res.status(500).json({ message: "Runtime Error: 6001", error: err });
		}
	});
});

router.post("/", auth.authenticateToken, (req, res) => {
	const data = req.body;

	sql = `INSERT INTO clients_phones_repairs 
		(failure, notes, date_in, date_repair, status, phone_id)  VALUES (?, ?, ?, ?, ?, ?)`;

	conn.query(sql, [
		data.failure, data.notes, data.dateIn, data.dateOut, data.status, data.phoneId
	], (err, result) => {
		if (!err) {
			return res.status(200).json({ message: "Registro creado con exito" });
		} else {
			return res.status(500).json({ message: "Runtime Error: 5001", error: err });
		}
	});

});

router.put("/:id", auth.authenticateToken, (req, res) => {
	const { id } = req.params;
	const data = req.body;

	sql = `UPDATE clients_phones_repairs SET failure = ?, notes = ?, date_in = ?, 
		date_repair = ?, status = ?, phone_id = ? WHERE repair_id = ${id}`;

	conn.query(sql, [
		data.failure, data.notes, data.dateIn, data.dateOut, data.status, data.phoneId
	], (err, result) => {
		if (!err) {
			return res.status(200).json({ message: "Registro actualizado con exito" });
		} else {
			return res.status(500).json({ message: "Error actualizando el Registro", error: err });
		}
	});
});

module.exports = router;