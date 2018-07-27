const axios = require('axios');

const search = async (req, res) => {
  let word = await axios.get(`http://api.datamuse.com/words?sp=${req.params.word}&md=d&max=1`);
  let rhymes = await axios.get(`http://api.datamuse.com/words?rel_rhy=${req.params.word}&md=d&max=10`);
  let nearRhymes = await axios.get(`http://api.datamuse.com/words?rel_nry=${req.params.word}&md=d&max=10`);
  let synonyms = await axios.get(`http://api.datamuse.com/words?rel_syn=${req.params.word}&md=d&max=10`);
  let antonyms = await axios.get(`http://api.datamuse.com/words?rel_ant=${req.params.word}&md=d&max=10`);

  let result = {word: word.data, rhymes: rhymes.data, synonyms: synonyms.data, antonyms: antonyms.data, nearRhymes: nearRhymes.data}

  res.send(result);
}

module.exports = {
  search
}