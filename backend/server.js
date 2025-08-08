const express = require("express");
const fs = require("fs");
const path = require("path");
const app = express();

app.use(express.json());

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  next();
});


// app.use

app.get("/characters", (req, res) => {
    const filePath = path.join(__dirname, "characters.json");

    fs.readFile(filePath, "utf8", (err, data) => {
        if (err) {
            console.error("Erreur lors de la lecture du fichier:", err);
            return res.status(500).send("Erreur serveur");
        }

        try {
            const characters = JSON.parse(data);
            res.status(200).json(characters);
        } catch (parseError) {
            console.error("Erreur lors de l'analyse du JSON:", parseError);
            res.status(500).send("Erreur d'analyse JSON");
        }
    });
});

app.get("/characters/:id", (req, res) => {
    const filePath = path.join(__dirname, "characters.json");
    console.log("bonjour")

    fs.readFile(filePath, "utf8", (err, data) => {
        if (err) {
            return res.status(500).send("Erreur serveur");
        }

        try {
            const parsed = JSON.parse(data);

            const characters = Array.isArray(parsed) ? parsed : parsed.characters;

            if (!Array.isArray(characters)) {
                return res.status(500).send("Le fichier JSON n'est pas un tableau valide");
            }

            const id = parseInt(req.params.id);
            const character = characters.find(c => c.id === id);

            if (!character) {
                return res.status(404).send("NOT FOUND");
            }

            res.status(200).json(character);
        } catch (e) {
            res.status(500).send("Erreur d'analyse JSON");
        }
    });

});


app.post("/characters", (req, res) => {
    const filePath = path.join(__dirname, "characters.json");
    const newCharacterData = req.body;

    console.log(newCharacterData.name);

    fs.readFile(filePath, "utf8", (err, data) => {
        if (err) {
            return res.status(500).send("Erreur serveur");
        }

        try {
            const parsed = JSON.parse(data);

            const characters = Array.isArray(parsed) ? parsed : parsed.characters;

            if (!Array.isArray(characters)) {
                return res.status(500).send("Le fichier JSON n'est pas un tableau valide");
            }

            const maxId = characters.reduce((max, char) => Math.max(max, char.id || 0), 0);
            const newId = maxId + 1;

            const newCharacter = {
                "id": newId,
                ...newCharacterData
            }

            console.log(newCharacter)
            characters.push(newCharacter);


            const updatedData = Array.isArray(parsed)
                ? JSON.stringify(characters, null, 2)
                : JSON.stringify({ characters }, null, 2);

            fs.writeFile(filePath, updatedData, "utf8", (writeErr) => {
                if (writeErr) {
                    return res.status(500).send("Erreur lors de l'écriture du fichier");
                }

                res.status(201).json(newCharacter);
            });

        } catch (e) {
            res.status(500).send("Erreur d'analyse JSON");
        }

    });
})


app.delete("/characters/:id", (req, res) => {
    const filePath = path.join(__dirname, "characters.json");

    fs.readFile(filePath, "utf8", (err, data) => {
        if (err) {
            return res.status(500).send("Erreur serveur");
        }

        try {
            const parsed = JSON.parse(data);

            const characters = Array.isArray(parsed) ? parsed : parsed.characters;

            if (!Array.isArray(characters)) {
                return res.status(500).send("Le fichier JSON n'est pas un tableau valide");
            }

            const id = parseInt(req.params.id);
            const character = characters.find(c => c.id === id);

            if (!character) {
                return res.status(404).send("NOT FOUND");
            }



            characters.splice(retrouverId(characters, id), 1)

            // console.log(newCharacter)
            // characters.push(newCharacter);


            const updatedData = Array.isArray(parsed)
                ? JSON.stringify(characters, null, 2)
                : JSON.stringify({ characters }, null, 2);

            fs.writeFile(filePath, updatedData, "utf8", (writeErr) => {
                if (writeErr) {
                    return res.status(500).send("Erreur lors de l'écriture du fichier");
                }

                res.json(characters)
            });

        } catch (e) {
            res.status(500).send("Erreur d'analyse JSON");
        }

    });
})

app.put("/characters/:id", async (req, res) => {
    const filePath = path.join(__dirname, "characters.json");
    const id = parseInt(req.params.id);
    const newData = req.body;

    console.log(`Modification du personnage ID: ${id}`, newData);

    try {
        const data = await fs.promises.readFile(filePath, "utf8");
        const parsed = JSON.parse(data);
        
        const characters = Array.isArray(parsed) ? parsed : parsed.characters;
        if (!Array.isArray(characters)) {
            return res.status(500).json({ error: "Format de données invalide" });
        }

        const index = characters.findIndex(c => c.id === id);
        if (index === -1) {
            return res.status(404).json({ error: "Personnage non trouvé" });
        }

        characters[index] = { 
            ...characters[index], 
            ...newData,
            id 
        };

        const updatedData = Array.isArray(parsed) 
            ? JSON.stringify(characters, null, 2)
            : JSON.stringify({ characters }, null, 2);
        
        await fs.promises.writeFile(filePath, updatedData, "utf8");

        res.json(characters[index]); 

    } catch (err) {
        console.error("Erreur:", err);
        res.status(500).json({ error: err.message });
    }
});

function retrouverId(characters, id) {
    for (let i = 0; i <= characters.length; i++) {
        if (characters[i].id == id) {
            return i;
        }
    }
}


app.listen(8080, () => console.log("port 8080"))


// console.log(__dirname)


// GET /characters ==> Get all characters
// POST /characters ==> Create a new character
// GET /characters/:id ==> Get a character by ID
// PUT /characters/:id ==> Update a character by ID
// DELETE /characters/:id ==> Delete a character by ID