const DEFAULT_CHARACTER_STATS = {
  HP: 120,
  ATK: 10,
  DEF: 10,
  SPD: 10
};


// TODO: Make this return a random character
export function generateCharacter(name) {
 return {
  name,
  ...DEFAULT_CHARACTER_STATS
 }
};

export function renderCharInfo(character) {
  if (!character) {
    return;
  }

  return Object.keys(character).map((attribute, i) => {
    return (
      <p key={i}>{`${attribute}:${character[attribute]}`}</p>
    )
  })
};