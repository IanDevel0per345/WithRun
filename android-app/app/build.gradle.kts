plugins {
    id("com.android.application")
    id("org.jetbrains.kotlin.android")
}

android {
    namespace = "dev.withrun.mobile"
    compileSdk = 34

    defaultConfig {
        applicationId = "dev.withrun.mobile"
        minSdk = 26
        // proot runs binaries from the app's data directory; Android 10+ blocks that for targetSdk >= 29.
        targetSdk = 28
        versionCode = 1
        versionName = "0.1.0"
        ndk { abiFilters += "arm64-v8a" }
    }

    packaging {
        // proot and its loader ship as lib*.so and must exist as real files to be executed.
        jniLibs { useLegacyPackaging = true }
    }

    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_17
        targetCompatibility = JavaVersion.VERSION_17
    }
    kotlinOptions { jvmTarget = "17" }
}

dependencies {
    implementation("androidx.core:core-ktx:1.13.1")
    implementation("androidx.appcompat:appcompat:1.7.0")
    implementation("org.apache.commons:commons-compress:1.26.2")
}
