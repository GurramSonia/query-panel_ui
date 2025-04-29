pipeline {
    agent any

    environment {
        IMAGE_NAME = "soniagurramavari/query-panel-frontend"
        IMAGE_TAG = "v1"
    }

    stages {
        stage('Checkout') {
            steps {
                // Uncomment if pulling from Git
                // git 'https://github.com/your/repo.git'
                echo "Skipping checkout (optional)"
            }
        }

        stage('Build Docker Image') {
            steps {
                script {
                    docker.build("${IMAGE_NAME}:${IMAGE_TAG}")
                }
            }
        }

        stage('Push to DockerHub') {
            steps {
                withDockerRegistry([credentialsId: 'dockerhub-creds', url: '']) {
                    script {
                        docker.image("${IMAGE_NAME}:${IMAGE_TAG}").push()
                    }
                }
            }
        }
    }
}

