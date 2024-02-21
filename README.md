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

**Packer**
Enable the following APIs::
gcloud services enable sourcerepo.googleapis.com
gcloud services enable compute.googleapis.com
gcloud services enable servicemanagement.googleapis.com
gcloud services enable storage-api.googleapis.com

Verify Zone Existence: gcloud compute zones list --project=dev-nscc
To Debug: packer build -debug build.pkr.hcl

To Run: packer build .

gcloud projects add-iam-policy-binding dev-nscc \  
    --member=serviceAccount:packer-service-account@dev-nscc.iam.gserviceaccount.com\ 
    --role=roles/compute.imageUser
    
gcloud projects get-iam-policy dev-nscc --format='table(bindings.role)' --filter="bindings.members:serviceAccount:packer-service-account@dev-nscc.iam.gserviceaccount.com"

To check service account roles: google-cloud-sdk % gcloud projects get-iam-policy dev-nscc --format='table(bindings.role)' --filter="bindings.members:serviceAccount:webapp-service-account@dev-nscc.iam.gserviceaccount.com"

