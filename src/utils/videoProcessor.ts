import {FFmpegKit, ReturnCode} from 'ffmpeg-kit-react-native';
import {VideoFile} from 'react-native-vision-camera';

import {Frame} from '../screens/CreateMedia/Editor/types';

interface Video {
  path: string;
  startTime: string;
  endTime: string;
}

export const trim = async (video: Video) => {
  const _video = video.path.split('.');
  const name = video.path.substring(0, video.path.lastIndexOf('.'));
  const ext = _video.pop();

  const trimmedVideoPath = `${name}_trimmed.${ext}`;

  const session = await FFmpegKit.execute(
    `-y -i ${video.path} -ss ${video.startTime} -to ${video.endTime} -preset ultrafast -c:v copy -c:a copy ${trimmedVideoPath}`,
  );

  const returnCode = await session.getReturnCode();

  if (ReturnCode.isSuccess(returnCode)) {
    // SUCCESS
    return trimmedVideoPath;
  } else if (ReturnCode.isCancel(returnCode)) {
    // CANCEL
  } else {
    // ERROR
  }
};

export const genFrames = async (video: VideoFile) => {
  const source =
    video.path.substring(0, video.path.lastIndexOf('.')) || video.path;

  const framePath = `${source}_frame_%4d.png`;

  const session = await FFmpegKit.execute(
    `-i ${source}.mp4 -preset ultrafast -vf fps=1 ${framePath}`,
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