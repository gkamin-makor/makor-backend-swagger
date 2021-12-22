const sgMail = require('@sendgrid/mail')
sgMail.setApiKey(process.env.SEND_GRID_TOKEN)

async function sendEmail(emailToSend,onboarding_uuid){
  return new Promise((resolve,reject)=>{
   let mailOptions = {
       from: 'no-reply@makor-capital.com <no-reply@makor-capital.com>',
       to: emailToSend,
       subject: "Makor: Onboarding",
       html:mailContent(onboarding_uuid)
     }

   
  sgMail.send(mailOptions, (err,success)=>{
       if(err){
          resolve(false)
         
        }else{
          resolve(true)
        }
      })

  })
 }

 
const mailContent = (onboarding_uuid) => {

  
  
  

  return `
  <!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
  </head>
  <body>
      <center>

        <img height="200" width="250" src="${process.env.IMG_URL}" alt="Img failed">

          <p>
          
              Hello,
              <br />
              <br />
              Thank you for getting in touch with Makor Capital.
              <br />
              <br />
              
              As part of our commitment to remain a trusted cryptocurrency service, all
              of our counter-parties must be verified by our compliance department.
              <br>
              <br>
              Please find below a link to our onboarding form:
              <br>
              <a href='${process.env.FRONT_URL}/${onboarding_uuid}'>Submit onboarding documentation</a>
              <br>
              <br>
              Makor is fully committed to protecting client confidentiality.
              <br>
              Makor Capital guarantees that it will ensure that all the information provided will remain strictly confidential.
              <br>
              Kindly let us know if you need further assistance.
              <br>
              <br>
              
              Sincerely
              <br>
              Makor Compliance Team
              <br>
              <b>Makor Capital London Ltd</b>
              <br>
              6th Floor, 7/8 Savile Row
              <br>
              London W1S 3PE
              <br>
              +44 (0) 20 7290 5777
              <br>
              <a href="http://www.makor-capital.com">http://www.makor-capital.com</a>
              <br>
              <br>
              <b>Disclaimer</b>
              <br>
              <br>
              <small>
                  
                  Makor Capital Limited is an Appointed Representative of Makor Capital London Ltd which is authorised and regulated by the Financial Conduct Authority (625054).
                  
                  The information contained in this note issued by Makor Capital Limited is not intended to be advice nor a recommendation concerning cryptocurrency investment nor an offer or solicitation to buy or sell any cryptocurrency or related financial instrument.
                  
                  While we provide this information in good faith it is not intended to be relied upon by you and we accept no liability nor assume any responsibility for the consequences of any reliance that may be placed upon this note.
                  
                  
                </small>
                
                
                
            </center>
                
                
    </p>
  </body>
</html>

  `
}

module.exports = {
  sendEmail
}
 