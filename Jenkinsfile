pipeline {
    agent { label "WinNode" }
    
    environment {
        GIT_URL = ""
        DEPLOY_PATH = "D:\\WebDeployment\\KAWASAKI_Frontend\\"
    }
    
    stages {
        stage('Checkout') {
            steps {
                // Clean Workspace
                cleanWs()
                 
                // Checkout the repository
                script {
                    git branch: 'develop', 
                        url: GIT_URL
                    
                    // Retrieve last commit info
                    def cmd = 'git log -1 --pretty="Last Commit: %%cd , Message : %%s" --date=iso'
                    
                    def commitMessage = bat(script: cmd, returnStdout: true).trim()
                    // Parse the commit message to remove unnecessary parts
                    def parsedMessage = commitMessage.substring(commitMessage.indexOf('>') + cmd.length()).trim()
                    
                    // Save the last commit info to an environment variable
                    env.LAST_COMMIT = parsedMessage 
                }
                 
            }
        }
        stage('Install Dependencies') {
            steps {
                // Install dependencies using npm
                bat 'npm install --prefer-offline'
            }
        } 
        stage('Build') {
            steps {
                // Create or append to the .env file
                bat '''
                @echo off
                (
                    echo VITE_API_URL=http://27.254.253.176:84/api
                    echo VITE_BASE_URL=/kawasaki
                    echo VITE_GIT_COMMIT_LOG=%LAST_COMMIT%
                ) >> .env
                '''
                
                // Build the project using pnpm
                bat 'npm run build'
            }
         
        }
        stage('Deploy') {
            steps {
                // Delete old deployment and copy new version
                bat ''' echo %DEPLOY_PATH%  '''
                bat '''
                @echo off
                rmdir /S /Q %DEPLOY_PATH%
                xcopy /s /y /d /r dist\\ %DEPLOY_PATH%
                '''
            }
        }
    }
}
