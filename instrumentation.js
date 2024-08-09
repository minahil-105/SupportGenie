import dbConnect from "./app/lib/mongodb"

export async function register() {
    await dbConnect()
}
