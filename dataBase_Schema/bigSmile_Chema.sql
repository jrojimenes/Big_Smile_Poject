CREATE DATABASE DB_BIGSMILE;
use DB_BIGSMILE;


CREATE TABLE DB_BIGSMILE.TBPROFILE(
fiIdProfile           int         NOT NULL  AUTO_INCREMENT,
fcProfileName         varchar(50) NOT NULL,
fdCreateDate          datetime    NOT NULL,
fiStatus              int,
primary key (fiIdProfile)
);

/*===============================================================Create profile procedure===========================================*/
DELIMITER $$
CREATE PROCEDURE DB_BIGSMILE.SPWEBPROFILEINSERT(IN PCPROFILENAME VARCHAR(50))
BEGIN

DECLARE   CSIONE              BIT     DEFAULT                  1;
DECLARE   CSISUCCESSRESPONSE  boolean DEFAULT               true;
DECLARE   CSIERRORRESPONSE    boolean DEFAULT              false;

DECLARE EXIT HANDLER FOR SQLEXCEPTION 
BEGIN
      ROLLBACK;
      SELECT CSIERRORRESPONSE AS RESPONSE;
END;

START TRANSACTION;
         
      INSERT INTO DB_BIGSMILE.TBPROFILE (fcProfileName, fdCreateDate, fiStatus)
					    VALUES(PCPROFILENAME, (select now()), CSIONE);
      
COMMIT;
      SELECT  CSISUCCESSRESPONSE AS RESPONSE;
END$$
DELIMITER ;
/*===================================================================================================================================*/
/*===============================================================Select profiles===============================================*/

DELIMITER  $$

CREATE PROCEDURE DB_BIGSMILE.SPWEBRETURNPROFILES()
BEGIN
      
      DECLARE   CSIONE              BIT     DEFAULT                  1;
      
      SELECT  
             fiIdProfile,
             fcProfileName,
             fdCreateDate
             FROM DB_BIGSMILE.TBPROFILE
             WHERE fiStatus = CSIONE
             ORDER BY fcProfileName ASC;
      
END$$
DELIMITER ;
/*===================================================================================================================================*/

CREATE TABLE DB_BIGSMILE.TBUSERS(
fiIdUser             int          NOT NULL AUTO_INCREMENT,
fcUserName           varchar(50)  NOT NULL,
fcUserSecondName     varchar(50)  NOT NULL,
fcUserLastName       varchar(50)  NOT NULL,
fcMail               varchar(50)  NOT NULL,
fiPhoneNumber        varchar(10)  NOT NULL,
fiIdProfile          int          NOT NULL,
fdCreateDate         datetime     NOT NULL,
fcUserNickName       varchar(50)  NOT NULL,
fcUserPsw            varchar(100) NOT NULL,
fiStatus             int          NOT NULL,
PRIMARY KEY(fiIdUser),
FOREIGN KEY(fiIdProfile) REFERENCES TBPROFILE (fiIdProfile)      
);
/*===============================================================Create user procedure===============================================*/

DELIMITER  $$
CREATE PROCEDURE DB_BIGSMILE.SPWEBCREATEUSER(IN PCUSERNAME VARCHAR(50), IN PCUSERSECONDNAME VARCHAR(50), PUSERLASTNAME VARCHAR(50),
                                             IN PCMAIL VARCHAR(50), IN PIPHONENUMBER VARCHAR(10), IN PIPROFILEID INT, IN PCNICKNAME VARCHAR(50),
											 IN PCUSERPSW VARCHAR(100))
BEGIN
      
      DECLARE   CSIONE              BIT     DEFAULT                  1;
	  DECLARE   CSISUCCESSRESPONSE  boolean DEFAULT               true;
	  DECLARE   CSIERRORRESPONSE    boolean DEFAULT              false;

DECLARE EXIT HANDLER FOR SQLEXCEPTION 
BEGIN
      
      /*SELECT CSIERRORRESPONSE AS RESPONSE;*/
           -- Declare variables to hold diagnostics area information
    DECLARE errcount INT;
    DECLARE errno INT;
    DECLARE msg TEXT;
    DECLARE csiuno int default 1;
    GET CURRENT DIAGNOSTICS CONDITION csiuno
      errno = MYSQL_ERRNO, msg = MESSAGE_TEXT;
    SELECT 'current DA before mapped insert' AS op, errno, msg;
    GET STACKED DIAGNOSTICS CONDITION csiuno
      errno = MYSQL_ERRNO, msg = MESSAGE_TEXT;
    SELECT 'stacked DA before mapped insert' AS op, errno, msg;
END;

START TRANSACTION;
         
      INSERT INTO DB_BIGSMILE.TBUSERS (fcUserName, fcUserSecondName, fcUserLastName, fcMail, fiPhoneNumber, fiIdProfile, fdCreateDate, fcUserNickName, fcUserPsw, fiStatus)
					            VALUES(PCUSERNAME, PCUSERSECONDNAME, PUSERLASTNAME, PCMAIL, PIPHONENUMBER, PIPROFILEID, (select now()), PCNICKNAME, 
									  PCUSERPSW, CSIONE);
      
COMMIT;
      SELECT  CSISUCCESSRESPONSE AS RESPONSE;

      
END$$
DELIMITER ;
/*===================================================================================================================================*/

/*===============================================================Select user Information=============================================*/

DELIMITER  $$
CREATE PROCEDURE DB_BIGSMILE.SPWEBRETURNUSERINFO(IN PIUSERID INT, IN PCUSERNICKNAME VARCHAR(50))
BEGIN      

      DECLARE   CSCONE                    VARCHAR(10) DEFAULT  '1';
      DECLARE   CSICERO                   INT         DEFAULT    0;
      DECLARE   CSCIDUSRATTRIBUTE         VARCHAR(50) DEFAULT 'tbUsr.fiIdUser';
      DECLARE   CSCNICKNAMEATTRIBUTE      VARCHAR(50) DEFAULT 'tbUsr.fcUserNickName';
      DECLARE   VCCHARCONDITION           VARCHAR(50);
      DECLARE   VCCHARATTRIBUTETOVALIDATE VARCHAR(50);

DECLARE CONTINUE HANDLER FOR SQLEXCEPTION
  BEGIN
     -- Declare variables to hold diagnostics area information
    DECLARE errcount INT;
    DECLARE errno INT;
    DECLARE msg TEXT;
    DECLARE csiuno int default 1;
    GET CURRENT DIAGNOSTICS CONDITION csiuno
      errno = MYSQL_ERRNO, msg = MESSAGE_TEXT;
    SELECT 'current DA before mapped insert' AS op, errno, msg;
    GET STACKED DIAGNOSTICS CONDITION csiuno
      errno = MYSQL_ERRNO, msg = MESSAGE_TEXT;
    SELECT 'stacked DA before mapped insert' AS op, errno, msg;
  END;

IF  PIUSERID = CSICERO THEN

        SET VCCHARATTRIBUTETOVALIDATE = CSCNICKNAMEATTRIBUTE;
        SET VCCHARCONDITION           = CONCAT('\'',PCUSERNICKNAME,'\'');
        
	ELSE 
          SET VCCHARATTRIBUTETOVALIDATE = CSCIDUSRATTRIBUTE;
        SET VCCHARCONDITION           = (SELECT CONVERT(PIUSERID, CHAR));  
        
END IF;

SET @q = CONCAT('SELECT
					 fiIdUser,  
					 fcUserName,
					 fcUserSecondName,
					 fcUserLastName,
					 fcMail,
					 fiPhoneNumber,
					 prF.fcProfileName,
					 fcUserNickName,
                     fcUserPsw
					 FROM DB_BIGSMILE.TBUSERS tbUsr
					 INNER JOIN DB_BIGSMILE.TBPROFILE prF
					 on tbUsr.fiIdProfile = prF.fiIdProfile
					 WHERE tbUsr.fiStatus = ', CSCONE,' AND ', VCCHARATTRIBUTETOVALIDATE, ' = ' ,VCCHARCONDITION);

PREPARE stmt FROM @q;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;               
      
END$$
DELIMITER ;
/*===================================================================================================================================*/

call DB_BIGSMILE.SPWEBPROFILEINSERT('CLIENTE');



CALL DB_BIGSMILE.SPWEBRETURNUSERINFO (1, NULL);
DROP PROCEDURE DB_BIGSMILE.SPWEBRETURNUSERINFO;

 
SELECT * FROM DB_BIGSMILE.TBPROFILE;
SELECT * FROM DB_BIGSMILE.TBUSERS;
 
truncate table nodearch_dbconfig.tbprofile;
 
delete from nodearch_dbconfig.tbprofile;

drop procedure nodearch_dbconfig.SPWEBPROFILEINSERT;

drop procedure DB_BIGSMILE.SPWEBCREATEUSER;

call DB_BIGSMILE.SPWEBCREATEUSER('isa','jasso','adasd','asdas@gmail.com','2312321',1,'isa','1234');
