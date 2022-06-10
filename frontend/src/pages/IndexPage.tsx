import React, { useState, FC } from "react";
import { Box } from "@twilio-paste/core/box";
import { Card } from "@twilio-paste/core/card";
import { Flex } from "@twilio-paste/core/flex";
import { Button } from "@twilio-paste/core/button";
import { Heading } from "@twilio-paste/core/heading";
import { Input } from "@twilio-paste/core/input";
import { Label } from "@twilio-paste/core/label";
import { HelpText } from "@twilio-paste/core/help-text";
import { TextArea } from "@twilio-paste/core/textarea";
import { Checkbox } from "@twilio-paste/core/checkbox";

export const IndexPage: FC = () => {
  const [sendState, setSendState] = useState("idle");
  const [fileLink, setFileLink] = useState("");
  const [fileData, setFileData] = useState<HTMLInputElement>();
  const [body, setBody] = useState("");
  const [from, setFrom] = useState(process.env.REACT_APP_DEFAULT_TWILIO_NUMBER);
  const [to, setTo] = useState("");
  const [results, setResults] = useState<any>({});
  const [deleteMedia, setDeleteMedia] = useState(true);

  const getS3SignUrl = async () => {
    console.log("file data: ", fileData);
    if (fileData) {
      console.log(fileData);
      const headers = new Headers({ "Content-Type": "application/json" });
      const options = {
        method: "POST",
        headers: headers,
        body: JSON.stringify({
          file: fileData.name,
          contentType: fileData.type,
          fileExtension: "jpg",
        }),
      };
      const response = await fetch(
        `${process.env.REACT_APP_RUNTIME_DOMAIN}/presignedurl`,
        options
      );

      // return signed URL
      return await response.json();
    }
  };

  const uploadToS3 = async (url: string, filename: string) => {
    if (fileData) {
      let fileToUpload = new File(
        // @ts-ignore
        [fileData.slice(0, fileData.size, fileData.type)],
        filename,
        { type: fileData.type }
      );

      // fileDetail.name = filename;
      const result = await fetch(url, {
        method: "PUT",
        body: fileToUpload,
      });
      console.log(result);
    }
  };

  const sendMessage = async (filename: string) => {
    const options = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        to,
        from,
        body,
        filename,
        url: `${process.env.REACT_APP_RUNTIME_DOMAIN}/media`,
        delete: deleteMedia
      }),
    };

    let messageData = await fetch(
      `${process.env.REACT_APP_RUNTIME_DOMAIN}/sendMessage`,
      options
    );
    setResults(await messageData.json());
  };

  const handleSubmit = async () => {
    setSendState("sending");
    const data = await getS3SignUrl();
    if (data) {
      console.log("Signed URL: ", data);
      await uploadToS3(data.uploadURL, data.filename);
    }

    await sendMessage(data?.filename);
    setSendState("idle");
  };

  const handleUploadChange = async (event: any) => {
    if (event.target.files) {
      const tmpFile = event.target.files[0];
      const tmpFileLink = URL.createObjectURL(tmpFile);
      setFileData(tmpFile);
      setFileLink(tmpFileLink);
    }
  };

  return (
    <Flex hAlignContent="center">
      <Box padding="space40"  width="size60">
        <Card>
          <Heading as="h1" variant="heading10">
            Twilio Media Proxy
          </Heading>
          <Box marginBottom="space80">
            <Label htmlFor="from" required>
              From Number
            </Label>
            <Input
              aria-describedby="from"
              id="from"
              name="from"
              type="text"
              placeholder="+18885551212"
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              required
            />
            <HelpText id="from_text">Twilio Number to send from</HelpText>
          </Box>
          <Box marginBottom="space80">
            <Label htmlFor="to" required>
              To Number
            </Label>
            <Input
              aria-describedby="to"
              id="to"
              name="to"
              type="text"
              placeholder="+18885551212"
              onChange={(e) => setTo(e.target.value)}
              required
            />
            <HelpText id="to_text">Phone Number to send to</HelpText>
          </Box>
          <Box marginBottom="space80">
            <Label htmlFor="message" required>
              Text Message
            </Label>
            <TextArea
              aria-describedby="message"
              id="message"
              name="message"
              onChange={(e) => setBody(e.target.value)}
              placeholder="Type youre message here"
              required
            />
            <HelpText id="message_text">Enter message text to send</HelpText>
          </Box>
          <Box marginBottom="space80">
          <input
            aria-describedby="media"
            id="media"
            name="media"
            type="file"
            accept=".png,.jpg,.jpeg"
            onChange={handleUploadChange}
            required
          />

          <Checkbox
            id="controlled"
            value="controlled"
            name="controlled"
            checked={deleteMedia}
            onChange={(event) => {
              setDeleteMedia(event.target.checked);
            }}
          >
            Delete media after sending.
          </Checkbox>
          </Box>

          <Button
            variant="primary"
            onClick={handleSubmit}
            loading={sendState === "sending" ? true : false}
          >
            Send Message
          </Button>
          {results?.status && (
            <HelpText id="message Sent">
              Your message has been {results?.status}
            </HelpText>
          )}
        </Card>
      </Box>
      <Box padding="space40">
        <Card>
          <Heading as="h2" variant="heading20">
            Media Preview
          </Heading>
          <div style={{ height: "300px", width: "300px" }}>
            {fileLink ? (
              <img
                src={fileLink}
                alt="img-preview"
                style={{ maxHeight: "300px", maxWidth: "300px" }}
              />
            ) : (
              "No Media Selected"
            )}
          </div>
        </Card>
      </Box>
    </Flex>
  );
};
