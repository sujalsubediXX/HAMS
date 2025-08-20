export function hungarianAlgorithm(costMatrix) {
  // Clone the original matrix to avoid mutation
  const matrix = costMatrix.map((row) => [...row]);
  const n = matrix.length;
  const m = matrix[0].length;

  // Initialize variables
  const u = new Array(n + 1).fill(0);
  const v = new Array(m + 1).fill(0);
  const p = new Array(m + 1).fill(0);
  const way = new Array(m + 1).fill(0);

  // For each row in the matrix
  for (let i = 1; i <= n; i++) {
    p[0] = i;
    let minj = 0;
    const minv = new Array(m + 1).fill(Infinity);
    const used = new Array(m + 1).fill(false);

    let j0 = 0;
    do {
      used[j0] = true;
      const i0 = p[j0];
      let delta = Infinity;
      let j1 = 0;

      // Find the minimum value in the row
      for (let j = 1; j <= m; j++) {
        if (!used[j]) {
          const cur = matrix[i0 - 1][j - 1] - u[i0] - v[j];
          if (cur < minv[j]) {
            minv[j] = cur;
            way[j] = j0;
          }
          if (minv[j] < delta) {
            delta = minv[j];
            j1 = j;
          }
        }
      }

      // Update the potentials
      for (let j = 0; j <= m; j++) {
        if (used[j]) {
          u[p[j]] += delta;
          v[j] -= delta;
        } else {
          minv[j] -= delta;
        }
      }

      j0 = j1;
    } while (p[j0] !== 0);

    // Update the path
    do {
      const j1 = way[j0];
      p[j0] = p[j1];
      j0 = j1;
    } while (j0 !== 0);
  }

  // Prepare the result
  const result = [];
  for (let j = 1; j <= m; j++) {
    if (p[j] > 0) {
      result.push([p[j] - 1, j - 1]);
    }
  }

  return result;
}

const timeToMinutes = (timeStr) => {
  const [h, m] = timeStr.split(":").map(Number);
  return h * 60 + m;
};

export const intervalScheduling = (appointments) => {
  appointments.sort((a, b) => timeToMinutes(a.end) - timeToMinutes(b.end));

  const selected = [];
  let lastEndTime = 0;

  for (const appt of appointments) {
    const startMin = timeToMinutes(appt.start);
    if (startMin >= lastEndTime) {
      selected.push(appt);
      lastEndTime = timeToMinutes(appt.end);
    }
  }
  return selected;
};

const toRad = (value) => (value * Math.PI) / 180;

export const HaversineAlgorithm = (loc1, loc2) => {
  const R = 6371; // Radius of Earth in kilometers

  const lat1 = loc1.lat;
  const lon1 = loc1.lng;
  const lat2 = loc2.lat;
  const lon2 = loc2.lng;

  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};
