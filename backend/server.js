const app = require("./src/app");
require('dotenv').config({ path: '../.env' });

const PORT = process.env.BACKEND_PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
