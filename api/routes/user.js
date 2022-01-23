const express = require("express");
const conn = require("../connection");
const router = express.Router();

const jwt = require("jsonwebtoken");

router.post("/signup", (req, res) => {
	const user = req.body;
	sql = "SELECT fullname, email, passw, role, status FROM users WHERE email = ?";
	conn.query(sql, [user.email], (err, result) => {
		if (!err) {
			if (result.length <= 0) {
				sql = "INSERT INTO users(fullname, email, passw, role) VALUES (?, ?, ?, ?)";
				conn.query(sql, [user.fullname, user.email, user.passw, user.role], (err, result) => {
					if (!err) {
						return res.status(200).json({ message: "Usuario creado con exito" });
					} else {
						return res.status(500).json(err);
					}
				});
			} else {
				return res.status(400).json({ message: "El correo electronico ya existe" });
			}
		} else {
			return res.status(500).json(err);
		}
	});
})

router.post("/login", (req, res) => {
	const user = req.body;
	sql = "SELECT fullname, email, passw, role, status FROM users WHERE email = ?"
	conn.query(sql, [user.email], (err, result) => {
		if (!err) {
			if (result.length > 0) {
				if (result[0].passw === user.passw && result[0].status === 1) {
					const response = { email: result[0].email, role: result[0].role, fullname: result[0].fullname };
					const accessToken = jwt.sign(response, process.env.ACCESS_TOKEN, { expiresIn: '8h' });

					res.status(200).json({ token: accessToken });

				} else if (result[0].passw !== user.passw) {
					return res.status(401).json({ message: "Usuario o Contraseña incorrecta" });
				} else if (result[0].status === 0) {
					return res.status(401).json({ message: `El usuario ${user.email} se encuentra pendiente por autorizacion` });
				}
			} else {
				return res.status(401).json({ message: "Usuario o Contraseña incorrecta" });
			}
		} else {
			return res.status(500).json(err);
		}
	});
});

router.get("/", (req, res) => {
	const data = req.body;

	sql = "SELECT user_id as id, fullname, email, passw, role, status FROM users";
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

router.post("/", (req, res) => {
	const data = req.body;

	sql = "SELECT email FROM users WHERE email = ?";
	conn.query(sql, [data.email], (err, result) => {
		if (!err) {
			if (result.length <= 0) {
				sql = "INSERT INTO users (fullname, email, passw, role, status) VALUES (?, ?, ?, ?, ?)";
				conn.query(sql, [data.fullname, data.email, data.passw, data.role, data.status], (err, result) => {
					if (!err) {
						return res.status(200).json({ message: "Usuario creado con exito" });
					} else {
						return res.status(500).json({ message: "Runtime Error: 5002", error: err });
					}
				});
			} else {
				return res.status(400).json({
					message: `Ya existe un cliente con el email ${data.email}`
				});
			}
		} else {
			return res.status(500).json({ message: "Runtime Error: 5001", error: err });
		}
	});
});

router.delete("/:id", (req, res) => {
	const { id } = req.params;

	sql = `DELETE FROM users WHERE user_id = ?`;
	conn.query(sql, [id], (err, result) => {
		if (!err) {
			return res.status(200).json({ message: "Usuario eliminado con exito" });
		} else {
			return res.status(500).json({ message: "Error eliminando al Usuario", error: err });
		}
	});
});

router.put("/:id", (req, res) => {
	const { id } = req.params;
	const data = req.body;

	sql = `UPDATE users SET fullname = ?, email = ?, passw = ?, role = ?, status = ? WHERE user_id = ${id}`;
	conn.query(sql, [data.fullname, data.email, data.passw, data.role, data.status], (err, result) => {
		if (!err) {
			return res.status(200).json({ message: "Usuario actualizado con exito" });
		} else {
			return res.status(500).json({ message: "Error actualizando al Usuario", error: err });
		}
	});
});

module.exports = router;