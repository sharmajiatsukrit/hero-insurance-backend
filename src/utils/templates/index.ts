export const claims_request_template = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width,initial-scale=1">
    <title>Claim Submission</title>
  </head>
  <body style="margin:0;padding:0;background:#f4f4f4;font-family:Arial,Helvetica,sans-serif;">

    <center style="width:100%;background:#f4f4f4;padding:20px 0;">
      <!-- Outer wrapper with gray background -->
      <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="max-width:640px;margin:0 auto;border-collapse:collapse;">
        <tr>
          <td style="padding:20px;">
            
            <!-- Inner white card -->
            <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background:#ffffff;border-collapse:collapse;border-radius:6px;overflow:hidden;">

              <!-- Logo -->
              <tr>
                <td style="padding:16px 24px;text-align:left;border-bottom:1px solid #e5e5e5;">
                  <img src="https://heroi.semseosmo.com/assets/main-logo-DGXMxbr3.png" alt="Hero Insurance Broking" style="max-width:150px;height:auto;display:block;">
                </td>
              </tr>

              <!-- Blue header -->
              <tr>
                <td style="padding:14px 24px;background:#4169e1;color:#fff;font-size:16px;font-weight:bold;">
                  Claim Submission
                </td>
              </tr>

              <!-- Body -->
              <tr>
                <td style="padding:20px 24px;font-size:14px;line-height:1.5;color:#222;">
                  Dear <strong>{{admin_team}}</strong>,<br><br>
                  I would like to submit a claim under my policy.<br>
                  Please find the details below:
                </td>
              </tr>

              <!-- Fields -->
              <tr>
                <td style="padding:0 24px 20px 24px;">
                  <table role="presentation" cellpadding="10" cellspacing="0" border="0" width="100%" style="font-size:14px;color:#222;border-collapse:separate;border-spacing:0 10px;">
                    <tr>
                      <td style="border:1px solid #ddd;background:#fafafa;">
                        <strong>Policy Number:</strong><br>{{policy_no}}
                      </td>
                    </tr>
                    <tr>
                      <td style="border:1px solid #ddd;background:#fafafa;">
                        <strong>Claim Type:</strong><br>{{insurance_type}}
                      </td>
                    </tr>
                    <tr>
                      <td style="border:1px solid #ddd;background:#fafafa;">
                        <strong>Date of Incident:</strong><br>{{date_incident}}
                      </td>
                    </tr>
                    <tr>
                      <td style="border:1px solid #ddd;background:#fafafa;">
                        <strong>Description:</strong><br>{{description}}
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>

              <!-- Closing -->
              <tr>
                <td style="padding:0 24px 20px 24px;font-size:14px;line-height:1.5;color:#222;">
                  Kindly confirm receipt of this claim and advise me on the next steps.<br><br>
                  Thank you,<br>
                  <strong>{{customer}}</strong><br>
                  {{customer_mobile}}
                </td>
              </tr>

              <!-- Support note -->
              <tr>
                <td style="padding:16px 24px;font-size:12px;line-height:1.5;color:#555;background:#fafafa;text-align:center;">
                  For any queries, please feel free to call us at 
                  <a href="tel:18001024376" style="color:#4169e1;text-decoration:none;">1800-102-4376</a>
                  or write to us at 
                  <a href="mailto:support@heroibil.com" style="color:#4169e1;text-decoration:none;">support@heroibil.com</a>. 
                  We’ll be happy to assist you.
                </td>
              </tr>

              <!-- Confidentiality note -->
              <tr>
                <td style="padding:12px 24px;font-size:11px;line-height:1.4;color:#666;background:#f0f0f0;text-align:center;">
                  <strong>Note:</strong> This email contains confidential information relating to an insurance claim. 
                  If you are not the intended recipient, please notify the sender and delete this message.
                </td>
              </tr>

              <!-- Footer -->
              <tr>
                <td style="padding:20px 24px;font-size:12px;line-height:1.6;color:#333;text-align:left;">
                  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;">
                    <tr>
                      <td width="50%" valign="top" style="padding-right:10px;">
                        <img src="https://heroi.semseosmo.com/assets/main-logo-DGXMxbr3.png" alt="Hero Insurance Broking" style="max-width:120px;height:auto;display:block;margin-bottom:8px;">
                        Hero Insurance Broking India Private Limited<br>
                        Corporate &amp; Registered Office:<br>
                        264, Okhla Industrial Estate, Phase III,<br>
                        New Delhi, India 110020
                      </td>
                      <td width="50%" valign="top" style="padding-left:10px;font-size:11px;color:#555;">
                        CIN No: U66010DL2007PTC165059<br>
                        IRDAI Registration No: 649<br>
                        IBAI Membership No: 15649<br>
                        Composite Broker • License valid till 25th July 2027<br>
                        Principal Officer: Mr. Swapnil Mandalia<br>
                        ISO 9001:2015 &amp; 27001:2013 Certified Company<br>
                        <a href="https://irdai.gov.in" style="color:#4169e1;text-decoration:none;">irdai.gov.in</a> | 
                        <a href="https://www.ibai.org" style="color:#4169e1;text-decoration:none;">ibai.org</a>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>

              <!-- Copyright -->
              <tr>
                <td style="padding:10px 24px;font-size:11px;color:#777;text-align:center;border-top:1px solid #e5e5e5;">
                  © 2025 Hero Insurance Broking. All rights reserved.
                </td>
              </tr>

            </table>
          </td>
        </tr>
      </table>
    </center>
  </body>
</html>`;

export const claim_acknowledgement_template = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>Claim Acknowledgement</title>
</head>
<body style="margin:0;padding:0;background:#f4f4f4;font-family:Arial,Helvetica,sans-serif;">

  <center style="width:100%;background:#f4f4f4;padding:20px 0;">
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="max-width:640px;margin:0 auto;border-collapse:collapse;">
      <tr>
        <td style="padding:20px;">

          <!-- White Card -->
          <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background:#ffffff;border-collapse:collapse;border-radius:6px;overflow:hidden;">

            <!-- Logo -->
            <tr>
              <td style="padding:16px 24px;text-align:left;border-bottom:1px solid #e5e5e5;">
                <img src="https://heroi.semseosmo.com/assets/main-logo-DGXMxbr3.png" alt="Hero Insurance Broking" style="max-width:150px;height:auto;display:block;">
              </td>
            </tr>

            <!-- Blue Header -->
            <tr>
              <td style="padding:14px 24px;background:#4169e1;color:#fff;font-size:16px;font-weight:bold;">
                Claim Acknowledgement
              </td>
            </tr>

            <!-- Body -->
            <tr>
              <td style="padding:20px 24px;font-size:14px;line-height:1.6;color:#222;">
                Dear <strong>{{customer_name}}</strong>,<br><br>
                We have received your claim request under Policy No. <strong>{{policy_no}}</strong> on <strong>{{date}}</strong>.<br><br>

                Our team will review the submitted documents and get back to you within <strong>{{business_days}}</strong>.<br><br>

                If additional information is required, we will contact you at your registered email/phone.<br><br>

                Thank you for choosing <strong>{{company_name}}</strong>.<br><br>

                Best regards,<br>
                <strong>{{claim_team}}</strong><br>
                Email: <a href="mailto:claims@yourdomain.com" style="color:#4169e1;text-decoration:none;">claims@yourdomain.com</a>
              </td>
            </tr>

          </table>

          <!-- Confidentiality Note -->
          <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="margin-top:10px;background:#ffffff;border-collapse:collapse;border-radius:6px;overflow:hidden;">
            <tr>
              <td style="padding:10px 20px;font-size:11px;line-height:1.4;color:#666;background:#f9f9f9;text-align:left;border-top:1px solid #ddd;">
                <strong>Note:</strong> This email contains confidential information relating to an insurance claim. 
                If you are not the intended recipient, please notify the sender and delete this message.
              </td>
            </tr>
          </table>

          <!-- Footer -->
          <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="margin-top:10px;background:#ffffff;border-collapse:collapse;border-radius:6px;overflow:hidden;">
            <tr>
              <td style="padding:20px 24px;font-size:12px;line-height:1.6;color:#333;text-align:left;">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;">
                  <tr>
                    <td width="50%" valign="top" style="padding-right:10px;">
                      <img src="https://heroi.semseosmo.com/assets/main-logo-DGXMxbr3.png" alt="Hero Insurance Broking" style="max-width:120px;height:auto;display:block;margin-bottom:8px;">
                      Hero Insurance Broking India Private Limited<br>
                      Corporate &amp; Registered Office:<br>
                      264, Okhla Industrial Estate, Phase III,<br>
                      New Delhi, India 110020
                    </td>
                    <td width="50%" valign="top" style="padding-left:10px;font-size:11px;color:#555;">
                      CIN No: U66010DL2007PTC165059<br>
                      IRDAI Registration No: 649<br>
                      IBAI Membership No: 15649<br>
                      Composite Broker • License valid till 25th July 2027<br>
                      Principal Officer: Mr. Swapnil Mandalia<br>
                      ISO 9001:2015 &amp; 27001:2013 Certified Company<br>
                      <a href="https://irdai.gov.in" style="color:#4169e1;text-decoration:none;">irdai.gov.in</a> | 
                      <a href="https://www.ibai.org" style="color:#4169e1;text-decoration:none;">ibai.org</a>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td style="padding:10px 24px;font-size:11px;color:#777;text-align:center;border-top:1px solid #e5e5e5;">
                © 2025 Hero Insurance Broking. All rights reserved.
              </td>
            </tr>
          </table>

        </td>
      </tr>
    </table>
  </center>
</body>
</html>
`;
export const lead_request_template = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width,initial-scale=1" />
    <title>Lead Request</title>
  </head>

  <body
    style="
      margin: 0;
      padding: 0;
      background: #f4f4f4;
      font-family: Arial, Helvetica, sans-serif;
    "
  >
    <center style="width: 100%; background: #f4f4f4; padding: 20px 0">
      <!-- Outer wrapper with gray background -->
      <table
        role="presentation"
        cellpadding="0"
        cellspacing="0"
        border="0"
        width="100%"
        style="max-width: 640px; margin: 0 auto; border-collapse: collapse"
      >
        <tr>
          <td style="padding: 20px">
            <!-- Inner white card -->
            <table
              role="presentation"
              cellpadding="0"
              cellspacing="0"
              border="0"
              width="100%"
              style="
                background: #ffffff;
                border-collapse: collapse;
                border-radius: 6px;
                overflow: hidden;
              "
            >
              <!-- Logo -->
              <tr>
                <td
                  style="
                    padding: 16px 24px;
                    text-align: left;
                    border-bottom: 1px solid #e5e5e5;
                  "
                >
                  <img
                    src="https://heroi.semseosmo.com/assets/main-logo-DGXMxbr3.png"
                    alt="Hero Insurance Broking"
                    style="max-width: 150px; height: auto; display: block"
                  />
                </td>
              </tr>

              <!-- Blue header -->
              <tr>
                <td
                  style="
                    padding: 14px 24px;
                    background: #4169e1;
                    color: #fff;
                    font-size: 16px;
                    font-weight: bold;
                  "
                >
                  Lead Request
                </td>
              </tr>

              <!-- Body -->
              <tr>
                <td
                  style="
                    padding: 20px 24px;
                    font-size: 14px;
                    line-height: 1.5;
                    color: #222;
                  "
                >
                  Dear <strong>Team</strong>,<br /><br />
                  We have received a new lead request. Please review and take
                  the necessary action.
                </td>
              </tr>

              <!-- Fields -->
              <tr>
                <td style="padding: 0 24px 20px 24px">
                  <table
                    role="presentation"
                    cellpadding="10"
                    cellspacing="0"
                    border="0"
                    width="100%"
                    style="
                      font-size: 14px;
                      color: #222;
                      border-collapse: separate;
                      border-spacing: 0 10px;
                    "
                  >
                    <tr>
                      <td style="border: 1px solid #ddd; background: #fafafa">
                        <strong>Name:</strong><br />{{name}}
                      </td>
                    </tr>
                    <tr>
                      <td style="border: 1px solid #ddd; background: #fafafa">
                        <strong>Mobile no:</strong><br />{{mobile_no}}
                      </td>
                    </tr>
                    <tr>
                      <td style="border: 1px solid #ddd; background: #fafafa">
                        <strong>Policy Type:</strong><br />{{policy_type}}
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>

              <!-- Closing -->
              <tr>
                <td
                  style="
                    padding: 0 24px 20px 24px;
                    font-size: 14px;
                    line-height: 1.5;
                    color: #222;
                  "
                >
                  Thank you,<br />
                </td>
              </tr>

              <!-- Footer -->
              <tr>
                <td
                  style="
                    padding: 20px 24px;
                    font-size: 12px;
                    line-height: 1.6;
                    color: #333;
                    text-align: left;
                  "
                >
                  <table
                    role="presentation"
                    width="100%"
                    cellpadding="0"
                    cellspacing="0"
                    border="0"
                    style="border-collapse: collapse"
                  >
                    <tr>
                      <td width="50%" valign="top" style="padding-right: 10px">
                        <img
                          src="https://heroi.semseosmo.com/assets/main-logo-DGXMxbr3.png"
                          alt="Hero Insurance Broking"
                          style="
                            max-width: 120px;
                            height: auto;
                            display: block;
                            margin-bottom: 8px;
                          "
                        />
                        Hero Insurance Broking India Private Limited<br />
                        Corporate &amp; Registered Office:<br />
                        264, Okhla Industrial Estate, Phase III,<br />
                        New Delhi, India 110020
                      </td>
                      <td
                        width="50%"
                        valign="top"
                        style="padding-left: 10px; font-size: 11px; color: #555"
                      >
                        CIN No: U66010DL2007PTC165059<br />
                        IRDAI Registration No: 649<br />
                        IBAI Membership No: 15649<br />
                        Composite Broker • License valid till 25th July 2027<br />
                        Principal Officer: Mr. Swapnil Mandalia<br />
                        ISO 9001:2015 &amp; 27001:2013 Certified Company<br />
                        <a
                          href="https://irdai.gov.in"
                          style="color: #4169e1; text-decoration: none"
                          >irdai.gov.in</a
                        >
                        |
                        <a
                          href="https://www.ibai.org"
                          style="color: #4169e1; text-decoration: none"
                          >ibai.org</a
                        >
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>

              <!-- Copyright -->
              <tr>
                <td
                  style="
                    padding: 10px 24px;
                    font-size: 11px;
                    color: #777;
                    text-align: center;
                    border-top: 1px solid #e5e5e5;
                  "
                >
                  © 2025 Hero Insurance Broking. All rights reserved.
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </center>
  </body>
</html>
`;

export const talent_pool_form_template = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width,initial-scale=1" />
    <title>Talent Pool Application</title>
  </head>

  <body
    style="
      margin: 0;
      padding: 0;
      background: #f4f4f4;
      font-family: Arial, Helvetica, sans-serif;
    "
  >
    <center style="width: 100%; background: #f4f4f4; padding: 20px 0">
      <table
        role="presentation"
        cellpadding="0"
        cellspacing="0"
        border="0"
        width="100%"
        style="max-width: 720px; margin: 0 auto; border-collapse: collapse"
      >
        <tr>
          <td style="padding: 12px">
            <table
              role="presentation"
              cellpadding="0"
              cellspacing="0"
              border="0"
              width="100%"
              style="
                background: #ffffff;
                border-collapse: collapse;
                border-radius: 14px;
                overflow: hidden;
                border: 1px solid #e8e8e8;
              "
            >
              <!-- TOP HEADER -->
              <tr>
                <td
                  style="
                    background: #3f66ff;
                    padding: 18px 22px;
                    color: #ffffff;
                  "
                >
                  <table
                    role="presentation"
                    width="100%"
                    cellpadding="0"
                    cellspacing="0"
                    border="0"
                    style="border-collapse: collapse"
                  >
                    <tr>
                      <td width="120" valign="middle">
                        <img
                          src="https://heroi.semseosmo.com/assets/main-logo-DGXMxbr3.png"
                          alt="Hero Insurance Broking"
                          style="
                            width: 95px;
                            height: auto;
                            background: #fff;
                            padding: 8px;
                            border-radius: 10px;
                            display: block;
                          "
                        />
                      </td>

                      <td valign="middle" style="padding-left: 14px">
                        <div
                          style="
                            font-size: 28px;
                            font-weight: 700;
                            line-height: 1.2;
                          "
                        >
                          Hero Insurance Broking
                        </div>

                        <div
                          style="
                            font-size: 20px;
                            font-weight: 600;
                            margin-top: 4px;
                            opacity: 0.95;
                          "
                        >
                          Talent Pool Application
                        </div>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>

              <!-- SUB HEADER MESSAGE -->
              <tr>
                <td
                  style="
                    background: #f1f1f1;
                    padding: 14px 22px;
                    text-align: center;
                    color: #2f59ff;
                    font-size: 18px;
                    line-height: 1.4;
                    font-weight: 500;
                  "
                >
                  A new candidate profile has been submitted via the Talent Pool
                  Application Form. Please find the details below.
                </td>
              </tr>

              <!-- BODY WRAP -->
              <tr>
                <td style="padding: 24px 28px">
                  <!-- SECTION: Personal Information -->
                  <div
                    style="
                      font-size: 22px;
                      font-weight: 700;
                      color: #111;
                      margin-bottom: 12px;
                    "
                  >
                    Personal Information
                  </div>

                  <table
                    role="presentation"
                    width="100%"
                    cellpadding="0"
                    cellspacing="0"
                    border="0"
                    style="border-collapse: collapse; margin-bottom: 26px"
                  >
                    <tr>
                      <td
                        width="50%"
                        style="
                          padding: 10px 0;
                          color: #444;
                          font-size: 15px;
                        "
                      >
                        Full Name
                      </td>
                      <td
                        width="50%"
                        style="
                          padding: 10px 0;
                          color: #111;
                          font-size: 15px;
                          font-weight: 500;
                        "
                      >
                        {{full_name}}
                      </td>
                    </tr>

                    <tr>
                      <td style="padding: 10px 0; color: #444; font-size: 15px">
                        EmailAddress
                      </td>
                      <td
                        style="
                          padding: 10px 0;
                          font-size: 15px;
                          font-weight: 500;
                        "
                      >
                        <a
                          href="mailto:{{email}}"
                          style="color: #2f59ff; text-decoration: underline"
                          >{{email}}</a
                        >
                      </td>
                    </tr>

                    <tr>
                      <td style="padding: 10px 0; color: #444; font-size: 15px">
                        Contact Number
                      </td>
                      <td
                        style="
                          padding: 10px 0;
                          color: #111;
                          font-size: 15px;
                          font-weight: 500;
                        "
                      >
                        {{contact_number}}
                      </td>
                    </tr>

                    <tr>
                      <td style="padding: 10px 0; color: #444; font-size: 15px">
                        Current Location
                      </td>
                      <td
                        style="
                          padding: 10px 0;
                          color: #111;
                          font-size: 15px;
                          font-weight: 500;
                        "
                      >
                        {{current_location}}
                      </td>
                    </tr>

                    <tr>
                      <td style="padding: 10px 0; color: #444; font-size: 15px">
                        Preferred Location
                      </td>
                      <td
                        style="
                          padding: 10px 0;
                          color: #111;
                          font-size: 15px;
                          font-weight: 500;
                        "
                      >
                        {{preferred_location}}
                      </td>
                    </tr>
                  </table>

                  <!-- SECTION: Professional Information -->
                  <div
                    style="
                      font-size: 22px;
                      font-weight: 700;
                      color: #111;
                      margin-bottom: 12px;
                    "
                  >
                    Professional Information
                  </div>

                  <table
                    role="presentation"
                    width="100%"
                    cellpadding="0"
                    cellspacing="0"
                    border="0"
                    style="border-collapse: collapse; margin-bottom: 26px"
                  >
                    <tr>
                      <td
                        width="50%"
                        style="
                          padding: 10px 0;
                          color: #444;
                          font-size: 15px;
                        "
                      >
                        Total Experience
                      </td>
                      <td
                        width="50%"
                        style="
                          padding: 10px 0;
                          color: #111;
                          font-size: 15px;
                          font-weight: 500;
                        "
                      >
                        {{total_experience}}
                      </td>
                    </tr>

                    <tr>
                      <td style="padding: 10px 0; color: #444; font-size: 15px">
                        Employment Status
                      </td>
                      <td
                        style="
                          padding: 10px 0;
                          color: #111;
                          font-size: 15px;
                          font-weight: 500;
                        "
                      >
                        {{employment_status}}
                      </td>
                    </tr>

                    <tr>
                      <td style="padding: 10px 0; color: #444; font-size: 15px">
                        Current Organization
                      </td>
                      <td
                        style="
                          padding: 10px 0;
                          color: #111;
                          font-size: 15px;
                          font-weight: 500;
                        "
                      >
                        {{current_organization}}
                      </td>
                    </tr>

                    <tr>
                      <td style="padding: 10px 0; color: #444; font-size: 15px">
                        Current Designation
                      </td>
                      <td
                        style="
                          padding: 10px 0;
                          color: #111;
                          font-size: 15px;
                          font-weight: 500;
                        "
                      >
                        {{current_designation}}
                      </td>
                    </tr>

                    <tr>
                      <td style="padding: 10px 0; color: #444; font-size: 15px">
                        Notice Period
                      </td>
                      <td
                        style="
                          padding: 10px 0;
                          color: #111;
                          font-size: 15px;
                          font-weight: 500;
                        "
                      >
                        {{notice_period}}
                      </td>
                    </tr>
                  </table>

                  <!-- SECTION: Role Preference -->
                  <div
                    style="
                      font-size: 22px;
                      font-weight: 700;
                      color: #111;
                      margin-bottom: 12px;
                    "
                  >
                    Role Preference
                  </div>

                  <table
                    role="presentation"
                    width="100%"
                    cellpadding="0"
                    cellspacing="0"
                    border="0"
                    style="border-collapse: collapse; margin-bottom: 26px"
                  >
                    <tr>
                      <td
                        width="50%"
                        style="
                          padding: 10px 0;
                          color: #444;
                          font-size: 15px;
                        "
                      >
                        Area(s) of Interest
                      </td>
                      <td
                        width="50%"
                        style="
                          padding: 10px 0;
                          color: #111;
                          font-size: 15px;
                          font-weight: 500;
                        "
                      >
                        {{areas_of_interest}}
                      </td>
                    </tr>

                    <tr>
                      <td style="padding: 10px 0; color: #444; font-size: 15px">
                        Specific Role
                      </td>
                      <td
                        style="
                          padding: 10px 0;
                          color: #111;
                          font-size: 15px;
                          font-weight: 500;
                        "
                      >
                        {{specific_role}}
                      </td>
                    </tr>
                  </table>

                  <!-- SECTION: Education & Skills -->
                  <div
                    style="
                      font-size: 22px;
                      font-weight: 700;
                      color: #111;
                      margin-bottom: 12px;
                    "
                  >
                    Education &amp; Skills
                  </div>

                  <table
                    role="presentation"
                    width="100%"
                    cellpadding="0"
                    cellspacing="0"
                    border="0"
                    style="border-collapse: collapse; margin-bottom: 26px"
                  >
                    <tr>
                      <td
                        width="50%"
                        style="
                          padding: 10px 0;
                          color: #444;
                          font-size: 15px;
                        "
                      >
                        Qualification
                      </td>
                      <td
                        width="50%"
                        style="
                          padding: 10px 0;
                          color: #111;
                          font-size: 15px;
                          font-weight: 500;
                        "
                      >
                        {{qualification}}
                      </td>
                    </tr>

                    <tr>
                      <td style="padding: 10px 0; color: #444; font-size: 15px">
                        Key Skills
                      </td>
                      <td
                        style="
                          padding: 10px 0;
                          color: #111;
                          font-size: 15px;
                          font-weight: 500;
                        "
                      >
                        {{key_skills}}
                      </td>
                    </tr>

                    <tr>
                      <td style="padding: 10px 0; color: #444; font-size: 15px">
                        Industry Experience
                      </td>
                      <td
                        style="
                          padding: 10px 0;
                          color: #111;
                          font-size: 15px;
                          font-weight: 500;
                        "
                      >
                        {{industry_experience}}
                      </td>
                    </tr>

                    <tr>
                      <td style="padding: 10px 0; color: #444; font-size: 15px">
                        Insurance Segment(s)
                      </td>
                      <td
                        style="
                          padding: 10px 0;
                          color: #111;
                          font-size: 15px;
                          font-weight: 500;
                        "
                      >
                        {{insurance_segments}}
                      </td>
                    </tr>
                  </table>

                  <!-- SECTION: Resume Submission -->
                  <div
                    style="
                      font-size: 22px;
                      font-weight: 700;
                      color: #111;
                      margin-bottom: 12px;
                    "
                  >
                    Resume Submission
                  </div>

                  <div style="font-size: 15px; color: #111; margin-bottom: 6px">
                    <strong>Filename:</strong>
                    <a
                      href="{{resume_url}}"
                      style="color: #2f59ff; text-decoration: underline"
                      >{{resume_filename}}</a
                    >
                  </div>
                  
                  <!-- SECTION: Additional Details -->
                  <div
                    style="
                      font-size: 22px;
                      font-weight: 700;
                      color: #111;
                      margin-bottom: 12px;
                    "
                  >
                    Additional Details
                  </div>

                  <table
                    role="presentation"
                    width="100%"
                    cellpadding="0"
                    cellspacing="0"
                    border="0"
                    style="border-collapse: collapse"
                  >
                    <tr>
                      <td
                        width="50%"
                        style="
                          padding: 10px 0;
                          color: #444;
                          font-size: 15px;
                          vertical-align: top;
                        "
                      >
                        Interest in Hero Insurance
                      </td>

                      <td
                        width="50%"
                        style="
                          padding: 10px 0;
                          color: #111;
                          font-size: 15px;
                          font-weight: 500;
                          vertical-align: top;
                        "
                      >
                        {{interest_in_hero}}
                      </td>
                    </tr>

                    <tr>
                      <td
                        width="50%"
                        style="
                          padding: 10px 0;
                          color: #444;
                          font-size: 15px;
                          vertical-align: top;
                        "
                      >
                        Additional Info
                      </td>

                      <td
                        width="50%"
                        style="
                          padding: 10px 0;
                          color: #111;
                          font-size: 15px;
                          font-weight: 500;
                          vertical-align: top;
                        "
                      >
                        {{additional_info}}
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>

              <!-- FOOTER BAR -->
              <tr>
                <td
                  style="
                    background: #3f66ff;
                    color: #fff;
                    text-align: center;
                    padding: 16px;
                    font-size: 14px;
                    font-weight: 500;
                  "
                >
                  © {{rights_year}} Hero Insurance Broking. All rights reserved.
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </center>
  </body>
</html>
`;

export function fillTemplate(template: string, data: any) {
    try {
        return template.replace(/{{\s*([^}]+?)\s*}}/g, (match, rawKey) => {
            const key = rawKey.trim();
            if (Object.prototype.hasOwnProperty.call(data, key)) {
                const val = data[key];
                return val == null ? "" : String(val);
            }
            const compact = key.replace(/\s*_\s*/g, "_").replace(/\s{2,}/g, " ");
            if (Object.prototype.hasOwnProperty.call(data, compact)) {
                const val = data[compact];
                return val == null ? "" : String(val);
            }
            return match;
        });
    } catch (error) {}
}
