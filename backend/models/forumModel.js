const conn = require('../db/db')

const forum = {
    // GET ALL THREAD
    getAllThread: (req, res) => {
        const sql = "SELECT * FROM forum"
        conn.query(sql, (err, fields) => {
            if (err) {
                return res.status(500).json({
                    status: "error",
                    message: "Internal Server Error"
                })
            }
            //response(200, fields, "data post", res)
            res.json(fields)
        })
    },
    // GET THREAD BY ID THREAD
    getThreadByID: (req, res) => {
        const id = req.params.id
        const sql = `SELECT * FROM forum WHERE id = ${id}`
        conn.query(sql, (err, fields) => {
            if (err) {
                res(err, null)
                return
            }
            res(null, fields)
        })
        // response(200, fields, `all detail post from ${id}`, res)
    },
    // GET THREAD BY ID USER
    getThreadByUser: (req, res) => {
        const user_id = req.params.user_id
        const sql = `SELECT * FROM forum WHERE user_id = ${user_id}`
        conn.query(sql, (err, fields) => {
            if (err) {
                res(err, null)
                return
            }
            res(null, fields)
        })
        // if (err) throw err
        // response(200, fields, `all detail post from ${user_id}`, res)
    },
    // POST THREAD
    postThread: async (req, res) => {
        try {
            const { user_id, text, images = null } = req.body
            const sql = `INSERT INTO forum (user_id, text, images) VALUES (${user_id}, '${text}', '${images}')`

            conn.query(sql, (err, fields) => {
                if (err) {
                    res(err, null)
                } else {
                    res(null, fields)
                }
            })
            // if (err) response(500, "invalid", "error", res)
            // if (fields?.affectedRows) {
            //     const data = {
            //         isSuccess: fields.affectedRows,
            //         id: fields.insertId
            //     }
            //     response(200, data, "posting forum", res)
            // }
        } catch (e) {
            console.error(e)
            res(e, null)
        }
    },
    // UPDATE THREAD
    updateThread: (req, res) => {
        try {
            const id = req.params.id
            const { text, images = null } = req.body
            const sql = `UPDATE forum SET text = '${text}', images = '${images}', updated_at = current_timestamp() WHERE id = ${id}`

            conn.query(sql, (err, fields) => {
                if (err) {
                    res(err, null)
                } else {
                    res(null, fields)
                }
            })
            // if (err) response(500, "invalid", "error", res)
            // if (fields?.affectedRows) {
            //     const data = {
            //         isSuccess: fields.affectedRows,
            //         message: fields.message,
            //     }
            //     response(200, data, "update post successfully", res)
            // } else {
            //     response(500, "user not found", "error", res)
            // }
        } catch (e) {
            console.error(e)
            res(e, null)
        }
    },
    deleteThread: (req, res) => {
        try {
            const id = req.params.id
            const sql = `DELETE FROM forum WHERE id = ${id}`
            conn.query(sql, (err, fields) => {
                if (err) {
                    res(err, null)
                } else {
                    res(null, fields)
                }
            })
            // if (err) response(500, "invalid", "error", res)
            // if (fields?.affectedRows) {
            //     const data = {
            //         isDeleted: fields.affectedRows,
            //     }
            //     response(200, data, "deleting post successfully", res)
            // } else {
            //     response(500, "user not found", "error", res)
            // }
        } catch (error) {
            console.error(e)
            res(e, null)
        }

    }


}

module.exports = forum
