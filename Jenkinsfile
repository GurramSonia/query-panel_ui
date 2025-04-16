pipeline {
    agent any

    environment {
        IMAGE_NAME = 'query-panel'
        TAG = 'v1'
    }

    stages {
        stage('Build Docker Image') {
            steps {
                sh "docker build -t ${IMAGE_NAME}:${TAG} ."
            }
        }
    }
}
