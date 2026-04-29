import { getApiDocs } from "../src/lib/swagger";
async function run() {
    try {
        const spec = await getApiDocs();
        console.log("Success");
    } catch (e) {
        console.error("Error:", e);
    }
}
run();
