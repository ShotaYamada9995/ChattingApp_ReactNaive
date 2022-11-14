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
    console.log(trimmedVideoPath);
    return trimmedVideoPath;
  } else if (ReturnCode.isCancel(returnCode)) {
    // CANCEL
  } else {
    // ERROR
  }
};

export const genFrames = async (fps, video) => {
  const name = video.path.substring(0, video.path.lastIndexOf('.'));
  const ext = 'png';

  const framePath = `${name}_frame_%2d.${ext}`;

  const session = await FFmpegKit.execute(
    `-i ${video.path} -preset ultrafast -vf fps=${fps} ${framePath}`,
  );

  const returnCode = await session.getReturnCode();

  if (ReturnCode.isSuccess(returnCode)) {
    // SUCCESS
    let frames: Frame[] = [];

    for (let time = 1; time <= 10; time++) {
      let frameIndex = `${time}`.padStart(2, '0');
      let frame = {
        time,
        image: `${name}_frame_${frameIndex}.${ext}`,
      };

      frames.push(frame);
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

export const genFrameAt = async (
  second: number,
  videoPath: string,
  id: string,
) => {
  const name = videoPath.substring(0, videoPath.lastIndexOf('.'));
  const ext = 'png';

  const framePath = `${name}_${id}.${ext}`;

  const session = await FFmpegKit.execute(
    `-ss ${second} -i ${videoPath} -preset ultrafast -vframes 1 -y ${framePath}`,
  );

  const returnCode = await session.getReturnCode();

  if (ReturnCode.isSuccess(returnCode)) {
    return framePath;
  }
};
