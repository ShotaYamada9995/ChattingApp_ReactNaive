import {FFmpegKit, ReturnCode} from 'ffmpeg-kit-react-native';
import {VideoFile} from 'react-native-vision-camera';

import {Frame} from '../screens/VideoCapture/VideoEditor/types';

export const trim = async (
  video: VideoFile,
  startTime: string,
  endTime: string,
) => {
  const source =
    video.path.substring(0, video.path.lastIndexOf('.')) || video.path;

  const trimmedVideoPath = `${source}_trimmed_0.mp4`;

  const session = await FFmpegKit.execute(
    `-y -i ${source}.mp4 -ss ${startTime} -to ${endTime} -c:v copy -c:a copy ${trimmedVideoPath}`,
  );

  const returnCode = await session.getReturnCode();

  if (ReturnCode.isSuccess(returnCode)) {
    // SUCCESS
    console.log('Success');
    return trimmedVideoPath;
  } else if (ReturnCode.isCancel(returnCode)) {
    // CANCEL
    console.log('Cancelled');
  } else {
    // ERROR
    console.log('Error');
  }
};

export const genFrames = async (video: VideoFile) => {
  const source =
    video.path.substring(0, video.path.lastIndexOf('.')) || video.path;

  const framePath = `${source}_frame_%4d.png`;

  const session = await FFmpegKit.execute(
    `-i ${source}.mp4 -vf fps=10 ${framePath}`,
  );

  const returnCode = await session.getReturnCode();

  if (ReturnCode.isSuccess(returnCode)) {
    // SUCCESS
    let frames: Frame[] = [];
    let count = 1;

    for (let time = 0; time <= video.duration; time += 0.1) {
      let frameIndex = `${count}`.padStart(4, '0');
      let frame = {
        time,
        image: `${source}_frame_${frameIndex}.png`,
      };

      frames.push(frame);

      count++;
    }

    return frames;
  }
  //  else if (ReturnCode.isCancel(returnCode)) {
  //   // CANCEL
  //   return 'cancelled';
  // } else {
  //   // ERROR
  //   return 'error';
  // }
};
