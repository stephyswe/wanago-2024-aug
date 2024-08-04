nest new wanago-2024
> npm
.
> npm run start 

### 1. API with NestJS #1. Controllers, routing and the module structure

npm run start:dev

### 2. API with NestJS #2. Setting up a PostgreSQL database with TypeORM

https://stackoverflow.com/questions/45122459/mounts-denied-the-paths-are-not-shared-from-os-x-and-are-not-known-to-docke

`docker-compose up -d postgres`

in Dbeaver
```
 -- Create the sequence
CREATE SEQUENCE post_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

-- Create the table
CREATE TABLE public.post
(
    id integer NOT NULL DEFAULT nextval('post_id_seq'::regclass),
    title character varying COLLATE pg_catalog."default" NOT NULL,
    content character varying COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT "PK_be5fda3aac270b134ff9c21cdee" PRIMARY KEY (id)
);
 ```

npm run start:dev

### 10. API with NestJS #10. Uploading public files to Amazon S3

AWS IAM

https://us-east-1.console.aws.amazon.com/iam/home#/users

> create user
```
username: s3-manager
permissions: attach policies directly - amazons3fullaccess    
```
view user - create access key 

```
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
```

AWS S3 Bucket
https://us-east-1.console.aws.amazon.com/s3/home?region=us-east-1

> create bucket
```
nestjs-series-public-bucket (add own prefix)
region: EU frankfurt
> remove 'block all public access'
```

Go to Permissions > Object Ownership > select ACL’s enabled > and select Bucket owner preferred