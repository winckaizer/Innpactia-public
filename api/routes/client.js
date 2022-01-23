const express = require("express");
const conn = require("../connection");
const router = express.Router();

var auth = require("../services/authentication");
var chrole = require("../services/checkRole");

router.get("/", auth.authenticateToken,(req, res) => {
	sql = "SELECT client_id as id, idnumber, fullname, address, phoneNumber FROM clients";
	conn.query(sql, (err, result) => {
		if (!err) {
			if (result.length > 0) {
				return res.status(200).json(result);
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

router.get("/:id", (req, res) => {
	const { id } = req.params;

	sql = `SELECT client_id as id, idnumber, fullname, address, phoneNumber FROM clients WHERE client_id = ${id}`;
	conn.query(sql, auth.authenticateToken,(err, result) => {
		if (!err) {
			if (result.length > 0) {
				return res.status(200).json(result);
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

router.post("/", auth.authenticateToken,(req, res) => {
	const data = req.body;

	sql = "SELECT idnumber FROM clients WHERE idnumber = ?";
	conn.query(sql, [data.idnumber], (err, result) => {
		if (!err) {
			if (result.length <= 0) {
				sql = "INSERT INTO clients (idnumber, fullname, address, phoneNumber) VALUES (?, ?, ?, ?)";
				conn.query(sql, [data.idnumber, data.fullname, data.address, data.phoneNumber], (err, result) => {
					if (!err) {
						return res.status(200).json({ message: "Cliente creado con exito" });
					} else {
						return res.status(500).json(err);
					}
				});
			} else {
				return res.status(400).json({
					message: `Ya existe un cliente con el numero de identificaion ${data.idnumber}`
				});
			}
		} else {
			return res.status(500).json({ message: "Runtime Error: 5001", error: err });
		}
	});
});

router.delete("/:id", auth.authenticateToken,(req, res) => {
	const { id } = req.params;

	sql = `DELETE FROM clients WHERE client_id = ?`;
	conn.query(sql, [id], (err, result) => {
		if (!err) {
			return res.status(200).json({ message: "Cliente eliminado con exito" });
		} else {
			return res.status(500).json({ message: "Error eliminando el Cliente", error: err });
		}
	});
});

router.put("/:id", auth.authenticateToken,(req, res) => {
	const { id } = req.params;
	const data = req.body;

	sql = `UPDATE clients SET idnumber = ?, fullname = ?, address = ?, phoneNumber = ? WHERE client_id = ${id}`;
	conn.query(sql, [data.idnumber, data.fullname, data.address, data.phoneNumber], (err, result) => {
		if (!err) {
			return res.status(200).json({ message: "Cliente actualizado con exito" });
		} else {
			return res.status(500).json({ message: "Error actualizando al Cliente", error: err });
		}
	});
});

module.exports = router;