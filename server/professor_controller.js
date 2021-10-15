var express = require('express');
var router = express.Router();
var Professor = require('./professor');

router.post('/', (req, res) => {
	let prof = new Professor({
		name: req.body.name,
		cpf: req.body.cpf,
		disciplina: req.body.disciplina
	})

	prof.save((err, d) => {
		if (err) {
			res.status(500).send(err);
		} else {
			res.status(200).send(d); 
		}
	})
})

router.get('/', (req, res) => {
	Professor.find().exec((err, professors) => {
		if (err) {
			res.status(500).send(err);
		} else {
			res.status(200).send(professors);
		}
	})
})


router.delete('/:id', async (req, res) => {
	try {
		let id = req.params.id;
		await Professor.deleteOne({ _id: id }) 
		res.status(200).send({})
	}
	catch (err) {
		res.status(500).send({ msg: 'Internal Error', error: err })
	}
})

router.patch('/:id', (req, res) => {
	Professor.findById(req.params.id, (err, prof) => {
		if (err) {
			res.status(500).send(err);
		}
		else if (!prof) {
			res.status(404).send({ prof })
		}
		else {
			prof.name = req.body.name;
			prof.cpf = req.body.cpf;
			prof.disciplina = req.body.disciplina;
			prof.save() 
				.then((p) => res.status(200).send(p))
				.catch((err) => res.status(500).send(err))
		}
	})
})

module.exports = router;
