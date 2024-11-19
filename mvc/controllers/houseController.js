import House from "../models/houseSchema.js"


// Controller functions
export const createHouse = (req, res) => {
    const {id, title, category, location, price, image, description } = req.body;
    const newHouse = new House({id, title, category, location, price, image, description });
    newHouse.save()
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
};

export const getHouse = (req, res) => {
    House.find()
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));
};

export const getHouseById = (req, res) => {
    const { id } = req.params;
    House.findById(id)
        .then((data) => res.json(data))
        .catch((error) => res.json({ message: error }));3
};