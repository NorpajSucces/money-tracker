// Command di jenkins mode pipeline

pipeline {
    agent any

    environment {
        // Mengambil path file rahasia dari Jenkins Credentials
        BACKEND_ENV = credentials('money-tracker-backend-env')
        FRONTEND_ENV = credentials('money-tracker-frontend-env')
    }

    stages {
        stage('Checkout Source Code') {
            steps {
                // menarik kode dari github
                checkout scm
            }
        }
        stage('Prepare Environment Files'){
            steps {
                bat """
                    @echo off
                    copy "%BACKEND_ENV_PATH%" "backend-money-tracker\.env"
                    copy "%FRONTEND_ENV_PATH%" "frontend-money-tracker\.env"

                    echo === CEK ISI ENV BACKEND ===
                    type "backend-money-tracker\.env"
                    echo ===========================
                """
            }
        }
        stage('Docker Deployment'){
            steps {
                """
                docker-compose down --remove-orphans
                docker-compose up -d --build
                """
            }
        }
        stage('Verify Containers'){
            steps {
                bat "docker ps"
            }
        }
    }

    post {
        always {
            echo 'Build selesai dikerjakan'
        }
        success {
            echp 'Aplikasi berhasil di-deploy'
        }
        failure {
            echo 'Build gagal, cek console output/log'
        }
    }
}


// Command di jenkins mode free style 

// copy "%BACKEND_ENV_FILE%" "backend-money-tracker\.env"
// copy "%FRONTEND_ENV_FILE%" "frontend-money-tracker\.env"

// :: Mengecek isi file (Jenkins akan menyamarkan password dengan ****, tapi struktur teksnya akan terlihat)
// echo === CEK ISI ENV BACKEND ===
// type "backend-money-tracker\.env"
// echo ===========================

// docker-compose down
// docker-compose up -d --build