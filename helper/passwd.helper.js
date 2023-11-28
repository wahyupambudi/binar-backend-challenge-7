const bcrypt = require('bcrypt')

function HashPassword(password){

    const saltParse = parseInt(process.env.SALT_ROUNDS)
    const salt = bcrypt.genSaltSync(saltParse)
    const hash = bcrypt.hashSync(password, salt)
    return hash
}

function ComparePassword(password, HashPassword){
    const compare = bcrypt.compareSync(password, HashPassword)
    return compare
}


module.exports ={
    HashPassword,
    ComparePassword
}
