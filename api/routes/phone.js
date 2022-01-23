const express = require("express");
const conn = require("../connection");
const router = express.Router();

var auth = require("../services/authentication");
var chrole = require("../services/checkRole");

router.get("/client/:id", auth.authenticateToken, (req, res) => {
	const { id } = req.params;

	sql = `SELECT phone_id as id, brand, model, serial, c.client_id, c.idnumber, c.fullname, c.address, c.phoneNumber
		FROM clients_phones p INNER JOIN clients c ON (c.client_id = p.client_id) WHERE c.client_id = ?`;
	conn.query(sql, [id], (err, result) => {
		if (!err) {
			if (result.length > 0) {
				let rows = [];
				result.forEach(element => {
					rows.push({
						id: element.id,
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

	sql = "SELECT phone_id as id, brand, model, serial FROM clients_phones WHERE serial = ?";
	conn.query(sql, [data.serial], (err, result) => {
		if (!err) {
			if (result.length <= 0) {
				sql = "INSERT INTO clients_phones (client_id, brand, model, serial) VALUES (?, ?, ?, ?)";
				conn.query(sql, [data.clientId, data.brand, data.model, data.serial], (err, result) => {
					if (!err) {
						return res.status(200).json({ message: "Cliente creado con exito" });
					} else {
						return res.status(500).json({ message: "Runtime Error: 5002", error: err });
					}
				});
			} else {
				return res.status(400).json({
					message: `Ya existe un dispositivo registrado con el serial ${data.serial}`
				});
			}
		} else {
			return res.status(500).json({ message: "Runtime Error: 5001", error: err });
		}
	});
});

router.delete("/:id", auth.authenticateToken, (req, res) => {
	const { id } = req.params;

	sql = `DELETE FROM clients_phones WHERE phone_id = ?`;
	conn.query(sql, [id], (err, result) => {
		if (!err) {
			return res.status(200).json({ message: "Cliente eliminado con exito" });
		} else {
			return res.status(500).json({ message: "Error eliminando el Cliente", error: err });
		}
	});
});

router.put("/:id", auth.authenticateToken, (req, res) => {
	const { id } = req.params;
	const data = req.body;

	sql = `UPDATE clients_phones SET client_id = ?, brand = ?, model = ?, serial = ? WHERE phone_id = ${id}`;
	conn.query(sql, [data.clientId, data.brand, data.model, data.serial], (err, result) => {
		if (!err) {
			return res.status(200).json({ message: "Cliente actualizado con exito" });
		} else {
			return res.status(500).json({ message: "Error actualizando al Cliente", error: err });
		}
	});
});

module.exports = router;