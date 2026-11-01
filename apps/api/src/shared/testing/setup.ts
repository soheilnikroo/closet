process.env["NODE_ENV"] = "test";
process.env["DATABASE_URL"] ??= "postgresql://closet:closet@localhost:5432/closet";
process.env["WEB_ORIGIN"] ??= "http://127.0.0.1:5173";
process.env["CLERK_PUBLISHABLE_KEY"] ??= "pk_test_replace_me";
process.env["CLERK_SECRET_KEY"] ??= "sk_test_replace_me";
process.env["WEATHER_PROVIDER"] ??= "mock";
process.env["LOCAL_STORAGE_DIR"] ??= ".data/test-storage";
