# webapp </br>
webapp- assignment2-cloud computing </br>
**Prerequisites for building and deploying your application:** </br>
    1. MySQL DB </br>
    2. NodeJS (Version 20) </br>
    3. Sequelize (3rd party package for ORM in Node) </br>
    4. bcryptjs </br>
    5. express </br>
    6. sequelize </br>
**Steps to deploy it locally.** </br>
    clone fork repo: git clone git@github.com:DevikaBoddu13/webapp.git </br>
**Build and Deploy instructions for the web application:** </br>
    1. npm install </br>
    2. Install dependences: npm install express </br>
    3. Build: npm run build </br>
    4. Run: npm start </br>
    5. Test: npm test </br>
**GCP**</br>
    1. Authenticate with gcloud: gcloud auth login</br>
    2. Created a DEV-NSCC project : gcloud config set project dev-nscc</br>
    3. Created a service account user</br>
    4. Enabled the following APIs::</br>
        gcloud services enable sourcerepo.googleapis.com</br>
        gcloud services enable compute.googleapis.com</br>
        gcloud services enable servicemanagement.googleapis.com</br>
        gcloud services enable storage-api.googleapis.com</br>
**Packer**</br>
    1. Packer format: packer fmt .</br>
    2. Packer validate: packer validate .</br>
    3. Packer Debug: packer build -debug build.pkr.hcl</br>
    4. Packer build: packer build .</br>
    5. review



