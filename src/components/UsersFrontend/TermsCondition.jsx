import React from "react";
import { useNavigate } from "react-router-dom";

const TermsCondition = () => {
  const navigate = useNavigate();
  return (
    <div className="w-full broder border-gray-100 p-2 h-svh flex flex-col gap-8">
      <div className="w-full flex justify-end">
        <button
          onClick={() => navigate("/")}
          className="py-1 px-2 border font-semibold"
        >
          Back to Login
        </button>
      </div>
      <div className="p-2 flex flex-col gap-8">
        <h1 className="text-6xl font-bold font-sans">Terms & Conditions</h1>
        <p className="">
          The Customers (users) of Manomilan.com using this site by
          implication, means that user have gone through and agreed to abide by
          following, disclaimer, Terms & Conditions. No warranty It is
          imperative to note that MANOMILAN.COM has taken required efforts to
          ensure that the information /statement/certificate provided on the
          MANOMILAN.COM's Web Site is reasonably accurate, however,
          MANOMILAN.COM does not warrant its accuracy, completeness or
          suitability, correctness, adequacy, validity, whatsoever for any
          purpose. As such database provided is without any warranty, express or
          implied, as to their legal effect. No Liability to
          MANOMILAN.COMThough, MANOMILAN.COM has taken proper care/precaution to
          make the database reliable, MANOMILAN.COM will not be held responsible
          for any liability that may arise out of any such error in the data
          base. Further, MANOMILAN.COM does not represent that MANOMILAN.COM's
          Web Site is free of viruses or harmful components.Use of any
          information/statement/certificate on MANOMILAN.COM's Web site shall be
          at your own risk.All information/statements/certificates should be
          used in accordance with applicable laws. And MANOMILAN.COM does not
          undertake any kind of liability whatsoever for the same.In case of
          transaction/ statement /certificate is not in agreement with your
          record or with the information that you have, you are requested to
          write to MANOMILAN.COM. You are free to mail your queries
          onMANOMILAN.COM has provided information/data base on the Web Site on
          an "as is where is " basis. Manomilan.com expressly disclaims to the
          maximum limit permissible by law, all warranties, express or implied,
          fitness for a particular purpose and non-infringement.MANOMILAN.COM
          disclaims all responsibility for any loss, injury, liability or damage
          of any kind resulting from and arising out of, your use of the site.
          Other Terms & conditions. It will be the sole responsibility of the
          User to ensure that the username and password are kept confidential
          and not disclosed to any third party, including any representative of
          the MANOMILAN.COM, or its agents and shall take all possible care to
          prevent discovery of the username or password by any
          person.MANOMILAN.COM makes no representations about the timeliness, of
          the services contained on the MANOMILAN.COM web site for any
          purpose.MANOMILAN.COM makes no representations about the suitability,
          reliability, availability, of the services contained on the
          MANOMILAN.COM web site for any purpose.MANOMILAN.COM shall not be
          responsible if any information/ database/ statement / certificate /
          page is printed/downloaded from MANOMILAN.COM's site and after
          printing/downloading complete/partial, text/information is altered /
          removed / obscured contained therein.MANOMILAN.COM, at no event , be
          liable/ responsible for any direct, indirect, punitive, incidental,
          special, consequential damages or any damages whatsoever including,
          without limitation, damages for loss of use, data or profits, arising
          out of or in any way connected with the use of the MANOMILAN.COM's web
          sites.MANOMILAN.COM, at no event, be liable/ responsible for any
          direct, indirect, punitive, incidental, special, consequential damages
          or any damages for the delay or inability to use the MANOMILAN.COM web
          site, or failure to provide services, or for any information, date,
          statement, certificate, software, and any other services obtained
          through the MANOMILAN.COM web sites, or otherwise arising out of the
          use of MANOMILAN.COM web site.Certain services, such as accounting
          information depends on continuous connection to the MANOMILAN.COM's
          database. MANOMILAN.COM makes no assurance, representation, promise
          whatsoever that such connectivity will always be
          available.MANOMILAN.COM reserves the right to suspend these services
          if in MANOMILAN.COMs opinion security of the site or of the data could
          be compromised.MANOMILAN.COM may also suspend services on the web site
          for any customer at its sole discretion without assigning any reason
          whatsoever. In such event user shall contact MANOMILAN.COM offices for
          any clarification.MANOMILAN
        </p>
      </div>
      <div className="border-t w-full border-gray-800 py-8 text-center text-black">
            <p>Powered By - Manisha Systems | Designed and Developed By - Alkesh Mahamune, Manas Kokate & Uzaif Khan</p>
          </div>
    </div>
  );
};

export default TermsCondition;
