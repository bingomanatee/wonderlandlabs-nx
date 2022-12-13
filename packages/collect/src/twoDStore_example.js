const twoDStore = new Map();

function store3DPoint(x, y, z) {
  const key = { x, y };
  const data = { x, y, z };
  const others = twoDStore.has(key) ? twoDStore.get(key) : [];
  twoDStore.set(key, [data, ...others]);
}

store3DPoint(0, 0, 1);
store3DPoint(0, 0, 2);
store3DPoint(0, 0, 3);

console.log('twoDStore:', twoDStore);

/**
 *  Map(3) {
  { x: 0, y: 0 } => [ { x: 0, y: 0, z: 1 } ],
  { x: 0, y: 0 } => [ { x: 0, y: 0, z: 2 } ],
  { x: 0, y: 0 } => [ { x: 0, y: 0, z: 3 } ]
}

 */
