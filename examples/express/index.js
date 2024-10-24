import express from "express"
import { withLogstrap } from "@logstrap/express"

const app = express();
const { middleware, logger, } = withLogstrap({
    apiKey: "",
    projectId: "",

})

app.use(middleware,)
app.get("/", (req, res, next) => {
    logger.log("hello world")
    res.json({
        message: "Hello World"
    })
})


app.listen(8000, () => {
    console.log('Server is running on port 8000');
});
