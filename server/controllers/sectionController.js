const addSection = (req, res) => {
  let {title, song_id} = req.body;
  req.app.get('db').sections.add_section([song_id, title, 'I - IV - V'])
    .then(sections => res.send(sections))
    .catch(err => res.send(err));
}

const getSections = (req, res) => {
  req.app.get('db').sections.get_sections(req.params.song_id)
    .then(sections => res.send(sections))
    .catch(err => res.send(err));
}

const deleteSection = (req, res) => {
  let {section_id, song_id} = req.params;
  req.app.get('db').sections.delete_section(section_id, song_id)
    .then(sections => res.send(sections))
    .catch(err => res.send(err));
  
}

const getSectionById = (req, res) => {
  req.app.get('db').sections.get_section_by_id(req.params.section_id)
    .then(section => res.send(section[0]))
    .catch(err => res.send(err));
}

const updateSection = (req, res) => {
  let {title, progression, lyrics, uploads} = req.body;
  lyrics = JSON.stringify(lyrics)
  uploads = JSON.stringify(uploads);
  req.app.get('db').sections.update_section(title, progression, lyrics, uploads, req.params.section_id)
    .then(section => res.send(section[0]))
    .catch(err => res.send(err));
}

module.exports = {
  addSection,
  getSections,
  deleteSection,
  getSectionById,
  updateSection
}