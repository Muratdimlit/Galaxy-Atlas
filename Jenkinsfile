pipeline {
    agent any

    stages {
        stage('Checkout') {
            steps {
                echo 'Galaxy Atlas projesi Jenkins tarafinda kontrol ediliyor.'
            }
        }

        stage('Backend Build') {
            steps {
                dir('backend') {
                    sh 'chmod +x mvnw'
                    sh './mvnw clean package -DskipTests'
                }
            }
        }

        stage('Result') {
            steps {
                echo 'Backend build basariyla tamamlandi.'
            }
        }
    }
}