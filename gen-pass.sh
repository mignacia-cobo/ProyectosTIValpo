#!/bin/bash
docker exec proyectosti_backend node -e "const bcrypt = require('bcrypt'); bcrypt.hash('mico1234', 10, (err, hash) => { if (err) console.error(err); else console.log(hash); });"
