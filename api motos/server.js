import express from 'express';
import cors from 'cors'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const app = express();
app.use(express.json());
app.use(cors())

app.post('/motos', async (req, res) => {
    try {
        const { placa, marca, ano } = req.body;

        const existeMotos = await prisma.motos.findUnique({
            where: {
                placa: placa,
            },
        });

        if (existeMotos) {
            return res.status(400).json({ msg: "Esta placa já existe!" });
        }

        const novaMoto = await prisma.motos.create({
            data: {
                placa,
                marca,
                ano,
            },
        });
        return res.status(201).json(novaMoto);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

app.get('/motos', async (req, res) => {
    try {
        const motos = await prisma.motos.findMany();
        res.status(200).json(motos);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
})

app.put('/motos/:placa', async (req, res) => {
    try {
        const { placa } = req.params
        const { marca, ano } = req.body;

        const moto = await prisma.motos.findUnique({
            where: { placa: placa },
        });

        const motoAtualizada = await prisma.motos.update({
            where: { placa: placa },
            data: {
                marca,
                ano,
            },
        });
        return res.status(200).json({ motoAtualizada });
    } catch (e) {
        res.status(500).json({ msg: e.message })
    }
});

app.delete('/motos/:placa', async (req, res) => {

    try {
        const { placa } = req.params;

        const moto = await prisma.motos.findUnique({
            where: { placa: placa },
        });

        if (!moto) {
            return res.status(404).json({ msg: "Moto não encontrada!" });
        }

        await prisma.motos.delete({
            where: { placa: placa },
        });

        return res.status(204).send();

    } catch (e) {
        res.status(500).json({ error: e.message });
    }

})
app.listen(3000, () => {
    console.log('conctado!');

});

export default prisma;