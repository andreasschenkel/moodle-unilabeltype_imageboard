<?php
// This file is part of Moodle - http://moodle.org/
//
// Moodle is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// Moodle is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with Moodle.  If not, see <http://www.gnu.org/licenses/>.

/**
 * Unilabel type imageboard
 *
 * @package     unilabeltype_imageboard
 * @author      Andreas Schenkel
 * @copyright   Andreas Schenkel {@link https://github.com/andreasschenkel}
 * @license     http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

namespace unilabeltype_imageboard;

/**
 * Content type definition
 *
 * @package     unilabeltype_imageboard
 * @author      Andreas Schenkel
 * @copyright   Andreas Schenkel {@link https://github.com/andreasschenkel}
 * @license     http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
class content_type extends \mod_unilabel\content_type {
    /** @var \stdClass $unilabeltyperecord */
    private $unilabeltyperecord;

    /** @var array $images */
    private $images;

    /** @var \stdClass $cm */
    private $cm;

    /** @var \context $context */
    private $context;

    /** @var \stdClass $config */
    private $config;

    /**
     * Constructor
     *
     * @return void
     */
    public function __construct() {
        $this->config = get_config('unilabeltype_imageboard');
    }

    /**
     * Add elements to the activity settings form.
     *
     * @param \mod_unilabel\edit_content_form $form
     * @param \context $context
     * @return void
     */
    public function add_form_fragment(\mod_unilabel\edit_content_form $form, \context $context) {
        global $OUTPUT;

        $unilabeltyperecord = $this->load_unilabeltype_record($form->unilabel->id);

        $mform = $form->get_mform();
        $prefix = 'unilabeltype_imageboard_';

        $mform->addElement('advcheckbox', $prefix . 'showintro', get_string('showunilabeltext', 'unilabeltype_imageboard'));

        $unilabel = $form->unilabel;
        $ispreviewmode = true;
        $cm = null;
        $dataToRender = $this->get_data_to_render($unilabel, $cm, $ispreviewmode);
        $renderedpreview = $OUTPUT->render_from_template('unilabeltype_imageboard/imageboard', $dataToRender);
        $mform->addElement('html', $renderedpreview);

        $mform->addElement('header', $prefix . 'hdr', $this->get_name());
        $mform->addHelpButton($prefix . 'hdr', 'pluginname', 'unilabeltype_imageboard');

        $numbers = array_combine(range(100, 1800, 50), range(100, 1800, 50));
        $mform->addElement('select', $prefix . 'canvaswidth', get_string('canvaswidth', 'unilabeltype_imageboard'), $numbers);

        $numbers = array_combine(range(100, 1800, 50), range(100, 1800, 50));
        $mform->addElement('select', $prefix . 'canvasheight', get_string('canvasheight', 'unilabeltype_imageboard'), $numbers);

        $mform->addElement('checkbox', $prefix . 'autoscale', get_string('autoscale', 'unilabeltype_imageboard'));
        $mform->addHelpButton($prefix . 'autoscale', 'autoscale', 'unilabeltype_imageboard');

        $mform->addElement(
                'filemanager',
                $prefix . 'backgroundimage',
                get_string('backgroundimage', 'unilabeltype_imageboard'),
                null,
                [
                        'maxbytes' => $form->get_course()->maxbytes,
                        'maxfiles' => 1,
                        'subdirs' => false,
                        'accepted_types' => ['web_image'],
                ]
        );
        $mform->setType('unilabeltype_imageboard_backgroundimage', PARAM_FILE);

        // Documentation where changes are needed if there will be added more settings e.g. fontsize of title
        // 1. content_type.php.
        // 2. Set default data for the imageboard in general.
        // 3. Set the selected value.
        // 4. Add setting in function get_content.
        // 5. Add setting to save_content.
        // 6. Add setting to install.
        // 7. Add setting to upgrade.
        // 8. Add setting to backup.
        // 9. Add Setting to restore.
        // 10. Add default-Value to settings.
        // 11. Add langstrings for settings.

        // 1. content_type.php.
        $numbers = array_combine(range(0, 36, 1), range(0, 36, 1));
        $mform->addElement('select', $prefix . 'fontsize', get_string('fontsize_help', 'unilabeltype_imageboard'), $numbers);

        $titlecolor = '';
        if (empty($unilabeltyperecord->titlecolor)) {
            $titlecolor = $this->config->default_titlecolor ?? '';
        } else {
            $titlecolor = $unilabeltyperecord->titlecolor;
        }
        $this->add_colourpicker($mform,
                $prefix . 'titlecolor',
                get_string('titlecolor', 'unilabeltype_imageboard'),
                $titlecolor);

        $titlebackgroundcolor = '';
        if (empty($unilabeltyperecord->titlebackgroundcolor)) {
            $titlebackgroundcolor = $this->config->default_titlebackgroundcolor ?? '';
        } else {
            $titlebackgroundcolor = $unilabeltyperecord->titlebackgroundcolor;
        }

        $this->add_colourpicker($mform,
                $prefix . 'titlebackgroundcolor',
                get_string('titlebackgroundcolor', 'unilabeltype_imageboard'),
                $titlebackgroundcolor);

        // Prepare the activity url picker.
        $formid = $mform->getAttribute('id');
        $course = $form->get_course();
        $picker = new \mod_unilabel\output\component\activity_picker($course, $formid);
        $inputidbase = 'id_' . $prefix . 'url_';
        $pickerbutton = new \mod_unilabel\output\component\activity_picker_button($formid, $inputidbase);
        $mform->addElement('html', $OUTPUT->render($picker));

        $repeatarray = [];
        // If we want each repeated elment in a numbered group we add a header with '{no}' in its label.
        // This is replaced by the number of element.
        $repeatarray[] = $mform->createElement(
                'header',
                $prefix . 'imagehdr',
                get_string('image', 'unilabeltype_imageboard') . '-{no}');
        $repeatarray[] = $mform->createElement(
                'text',
                $prefix . 'title',
                get_string('title', 'unilabeltype_imageboard') . '-{no}',
                ['size' => 50]
        );
        $repeatarray[] = $mform->createElement(
                'filemanager',
                $prefix . 'image',
                get_string('image', 'unilabeltype_imageboard') . '-{no}',
                null,
                [
                        'maxbytes' => $form->get_course()->maxbytes,
                        'maxfiles' => 1,
                        'subdirs' => false,
                        'accepted_types' => ['web_image'],
                ]
        );

        $position = [];
        $position[] = $mform->createElement('text',
                $prefix . 'xposition',
                get_string('xposition', 'unilabeltype_imageboard'),
                ['size' => 4, 'placeholder' => get_string('placeholder_xposition', 'unilabeltype_imageboard')]);
        $mform->setType($prefix . 'xposition', PARAM_INT);
        $position[] = $mform->createElement('text',
                $prefix . 'yposition',
                get_string('yposition', 'unilabeltype_imageboard'),
                ['size' => 4, 'placeholder' => get_string('placeholder_yposition', 'unilabeltype_imageboard')]);
        $mform->setType($prefix . 'yposition', PARAM_INT);
        $repeatarray[] = $mform->createElement('group',
                $prefix . 'position',
                get_string('position', 'unilabeltype_imageboard'),
                $position,
                null,
                false);
        $mform->setType($prefix . 'position', PARAM_RAW);

        $targetsize = [];
        $targetsize[] = $mform->createElement('text',
                $prefix . 'targetwidth',
                get_string('targetwidth', 'unilabeltype_imageboard'),
                ['size' => 4, 'placeholder' => get_string('placeholder_targetwidth', 'unilabeltype_imageboard')]);
        $mform->setType($prefix . 'targetwidth', PARAM_INT);
        $targetsize[] = $mform->createElement('text',
                $prefix . 'targetheight',
                get_string('targetheight', 'unilabeltype_imageboard'),
                ['size' => 4, 'placeholder' => get_string('placeholder_targetheight', 'unilabeltype_imageboard')]);
        $mform->setType($prefix . 'targetheight', PARAM_INT);
        $repeatarray[] = $mform->createElement('group',
                $prefix . 'targetsize',
                get_string('targetsize', 'unilabeltype_imageboard'),
                $targetsize,
                null,
                false);
        $mform->setType($prefix . 'targetsize', PARAM_RAW);

        $repeatarray[] = $mform->createElement(
                'text',
                $prefix . 'url',
                get_string('url', 'unilabeltype_imageboard') . '-{no}',
                ['size' => 50]
        );
        $repeatarray[] = $mform->createElement(
                'static',
                $prefix . 'activitypickerbutton',
                '',
                $OUTPUT->render($pickerbutton)

        );
        $numbers = array_combine(range(0, 10, 1), range(0, 10, 1));
        $repeatarray[] = $mform->createElement(
                'select',
                $prefix . 'border',
                get_string('border', 'unilabeltype_imageboard'),
                $numbers
        );

        $repeatedoptions = [];
        $repeatedoptions[$prefix . 'title']['type'] = PARAM_TEXT;
        $repeatedoptions[$prefix . 'url']['type'] = PARAM_URL;
        $repeatedoptions[$prefix . 'url']['helpbutton'] = ['url', 'unilabeltype_imageboard'];
        $repeatedoptions[$prefix . 'image']['type'] = PARAM_FILE;
        $repeatedoptions[$prefix . 'border']['type'] = PARAM_INT;
        $repeatedoptions[$prefix . 'border']['default'] = $this->config->default_bordersize;
        $repeatedoptions[$prefix . 'position']['helpbutton'] = ['position', 'unilabeltype_imageboard'];
        $repeatedoptions[$prefix . 'targetsize']['helpbutton'] = ['targetsize', 'unilabeltype_imageboard'];

        $defaultrepeatcount = 4; // The default count for images.
        $repeatcount = count($this->images);
        if ($rest = count($this->images) % $defaultrepeatcount) {
            $repeatcount = count($this->images) + ($defaultrepeatcount - $rest);
        }
        if ($repeatcount == 0) {
            $repeatcount = $defaultrepeatcount;
        }

        $nextel = $form->repeat_elements(
                $repeatarray,
                $repeatcount,
                $repeatedoptions,
                $prefix . 'chosen_images_count',
                $prefix . 'add_more_images_btn',
                $defaultrepeatcount, // Each time we add 3 elements.
                get_string('addmoreimages', 'unilabeltype_imageboard')
        );
    }

    /**
     * Get the default values for the settings form
     *
     * @param array $data
     * @param \stdClass $unilabel
     * @return array
     */
    public function get_form_default($data, $unilabel) {
        global $DB;

        $cm = get_coursemodule_from_instance('unilabel', $unilabel->id);
        $context = \context_module::instance($cm->id);

        $prefix = 'unilabeltype_imageboard_';

        // Set default data for the imageboard in general.
        if (!$unilabeltyperecord = $this->load_unilabeltype_record($unilabel->id)) {
            $data[$prefix . 'showintro'] = !empty($this->config->default_showintro);
            $data[$prefix . 'canvaswidth'] = $this->config->default_canvaswidth ?? '600';
            $data[$prefix . 'canvasheight'] = $this->config->default_canvasheight ?? '400';
            $data[$prefix . 'backgroundimage'] = 0;
            // 2. Set default data for the imageboard in general.
            $data[$prefix . 'fontsize'] = $this->config->default_fontsize ?? '12';
            $data[$prefix . 'titlecolor'] = $this->config->default_titlecolor ?? '#fffffe';
            $data[$prefix . 'titlebackgroundcolor'] = $this->config->default_titlebackgroundcolor ?? '#aaaaaa';
            return $data;
        }

        $data[$prefix . 'showintro'] = $unilabeltyperecord->showintro;

        $data[$prefix . 'canvaswidth'] = $unilabeltyperecord->canvaswidth;
        $data[$prefix . 'canvasheight'] = $unilabeltyperecord->canvasheight;
        $data[$prefix . 'autoscale'] = $unilabeltyperecord->autoscale;

        // Hint: $draftitemid is set by the function file_prepare_draft_area().
        $draftitemidbackgroundimage = 0; // This is needed to create a new draftitemid.
        file_prepare_draft_area($draftitemidbackgroundimage, $context->id, 'unilabeltype_imageboard', 'backgroundimage', 0);
        $data[$prefix . 'backgroundimage'] = $draftitemidbackgroundimage;

        // 3. Set the selected value.
        $data[$prefix . 'fontsize'] = $unilabeltyperecord->fontsize;
        $data[$prefix . 'titlecolor'] = $unilabeltyperecord->titlecolor;
        $data[$prefix . 'titlebackgroundcolor'] = $unilabeltyperecord->titlebackgroundcolor;

        // Set default data for images.
        if (!$images = $DB->get_records(
                'unilabeltype_imageboard_img',
                ['imageboardid' => $unilabeltyperecord->id],
                'id ASC'
        )) {
            return $data;
        }

        $index = 0;
        foreach ($images as $image) {
            // Prepare the title field.
            $elementname = $prefix . 'title[' . $index . ']';
            $data[$elementname] = $image->title;

            // Prepare the url field.
            $elementname = $prefix . 'url[' . $index . ']';
            $data[$elementname] = $image->url;

            // Prepare the url field.
            $elementname = $prefix . 'xposition[' . $index . ']';
            $data[$elementname] = $image->xposition;

            $elementname = $prefix . 'yposition[' . $index . ']';
            $data[$elementname] = $image->yposition;

            $elementname = $prefix . 'targetwidth[' . $index . ']';
            $data[$elementname] = $image->targetwidth;

            $elementname = $prefix . 'targetheight[' . $index . ']';
            $data[$elementname] = $image->targetheight;

            $elementname = $prefix . 'border[' . $index . ']';
            $data[$elementname] = $image->border;

            // Prepare the images.
            // $draftitemid is set by the function file_prepare_draft_area().
            $draftitemidimage = 0; // This is needed to create a new draftitemid.
            file_prepare_draft_area($draftitemidimage, $context->id, 'unilabeltype_imageboard', 'image', $image->id);
            $elementname = $prefix . 'image[' . $index . ']';
            $data[$elementname] = $draftitemidimage;

            $index++;
        }

        return $data;
    }

    /**
     * Validate all form values given in $data and returns an array with errors.
     * It does the same as the validation method in moodle forms.
     *
     * @param array $errors
     * @param array $data
     * @param array $files
     * @return array
     */
    public function form_validation($errors, $data, $files) {
        $prefix = 'unilabeltype_imageboard_';

        // Check the colour values.
        $colourvaluestocheck = ['titlecolor', 'titlebackgroundcolor'];
        foreach ($colourvaluestocheck as $cv) {
            if (!empty($data[$prefix . $cv])) {
                if (!\mod_unilabel\configcolourpicker_validation::validate_colourdata($data[$prefix . $cv])) {
                    $errors[$prefix . $cv] = get_string('invalidvalue', 'mod_unilabel');
                }
            }
        }
        return $errors;
    }

    /**
     * Get the namespace of this content type
     *
     * @return string
     */
    public function get_namespace() {
        return __NAMESPACE__;
    }

    /**
     * Get the html formated content for this type.
     *
     * @param \stdClass $unilabel
     * @param \stdClass $cm
     * @param \plugin_renderer_base $renderer
     * @return string
     */
    public function get_content($unilabel, $cm, \plugin_renderer_base $renderer) {
        global $OUTPUT;
        if (!$unilabeltyperecord = $this->load_unilabeltype_record($unilabel->id)) {
            return '';
        } else {
            $ispreviewmode = false;
            $dataToRender = $this->get_data_to_render($unilabel, $cm, $ispreviewmode);
            // Be able to create a json: $content_as_json = json_encode($content);.
            $content = $OUTPUT->render_from_template('unilabeltype_imageboard/imageboard', $dataToRender);
        }
        return $content;
    }

    /**
     * Delete the content of this type
     *
     * @param int $unilabelid
     * @return void
     */
    public function delete_content($unilabelid) {
        global $DB;

        $unilabeltyperecord = $this->load_unilabeltype_record($unilabelid);

        // Delete all images.
        if (!empty($unilabeltyperecord)) {
            $DB->delete_records('unilabeltype_imageboard_img', ['imageboardid' => $unilabeltyperecord->id]);
        }

        $DB->delete_records('unilabeltype_imageboard', ['unilabelid' => $unilabelid]);
    }

    /**
     * Save the content from settings page
     *
     * @param \stdClass $formdata
     * @param \stdClass $unilabel
     * @return bool
     */
    public function save_content($formdata, $unilabel) {
        global $DB, $USER;

        // We want to keep the images consistent so we start a transaction here.
        $transaction = $DB->start_delegated_transaction();

        $prefix = 'unilabeltype_imageboard_';

        // First save the imageboard record.
        if (!$unilabeltyperecord = $DB->get_record('unilabeltype_imageboard', ['unilabelid' => $unilabel->id])) {
            $unilabeltyperecord = new \stdClass();
            $unilabeltyperecord->unilabelid = $unilabel->id;
            $unilabeltyperecord->id = $DB->insert_record('unilabeltype_imageboard', $unilabeltyperecord);
        }

        $unilabeltyperecord->showintro = $formdata->{$prefix . 'showintro'};

        $unilabeltyperecord->canvaswidth = $formdata->{$prefix . 'canvaswidth'};
        $unilabeltyperecord->canvasheight = $formdata->{$prefix . 'canvasheight'};
        $unilabeltyperecord->autoscale = !empty($formdata->{$prefix . 'autoscale'});

        // 5. Add setting to save_content.
        $unilabeltyperecord->fontsize = $formdata->{$prefix . 'fontsize'};
        $unilabeltyperecord->titlecolor = $formdata->{$prefix . 'titlecolor'};
        $unilabeltyperecord->titlebackgroundcolor = $formdata->{$prefix . 'titlebackgroundcolor'};

        $fs = get_file_storage();
        $context = \context_module::instance($formdata->cmid);
        $usercontext = \context_user::instance($USER->id);
        // First: remove old image images.
        // We use the module_context as context and this component as component.
        $fs->delete_area_files($context->id, 'unilabeltype_imageboard', 'backgroundimage');
        $fs->delete_area_files($context->id, 'unilabeltype_imageboard', 'image');

        // Second: remove old image records.
        $DB->delete_records('unilabeltype_imageboard_img', ['imageboardid' => $unilabeltyperecord->id]);

        // Backgroundimage-support.
        $draftitemidbackgroundimage = $formdata->{$prefix . 'backgroundimage'};

        $unilabeltyperecord->canvaswidth = abs($formdata->{$prefix . 'canvaswidth'});
        $unilabeltyperecord->canvasheight = abs($formdata->{$prefix . 'canvasheight'});
        // 5. ToDo ... do we need code for fontsize here ???????

        file_save_draft_area_files($draftitemidbackgroundimage, $context->id, 'unilabeltype_imageboard', 'backgroundimage', 0);

        // Now update the record with the information collected for the "hole" board.
        // Information for each image follows.
        $DB->update_record('unilabeltype_imageboard', $unilabeltyperecord);

        // How many images could be defined (we have an array here)?
        // They may not all used so some could be left out.
        $potentialimagecount = $formdata->{$prefix . 'chosen_images_count'};
        for ($i = 0; $i < $potentialimagecount; $i++) {
            // Get the draftitemids to identify the submitted files in image and content.
            $draftitemidimage = $formdata->{$prefix . 'image'}[$i];

            // Do we have an image? We get this information with file_get_draft_area_info().
            $fileinfo = file_get_draft_area_info($draftitemidimage);
            // We only create a record if we have at least a title, a file or a content.
            $title = $formdata->{$prefix . 'title'}[$i];
            if (empty($title) && $fileinfo['filecount'] < 1) {
                continue;
            }

            $imagerecord = new \stdClass();
            $imagerecord->imageboardid = $unilabeltyperecord->id;
            $imagerecord->title = $title;
            $imagerecord->url = $formdata->{$prefix . 'url'}[$i];

            $imagerecord->xposition = abs($formdata->{$prefix . 'xposition'}[$i]);
            $imagerecord->yposition = abs($formdata->{$prefix . 'yposition'}[$i]);

            $imagerecord->targetwidth = abs($formdata->{$prefix . 'targetwidth'}[$i]);
            $imagerecord->targetheight = abs($formdata->{$prefix . 'targetheight'}[$i]);

            $imagerecord->border = abs($formdata->{$prefix . 'border'}[$i]);

            $imagerecord->id = $DB->insert_record('unilabeltype_imageboard_img', $imagerecord);

            $DB->update_record('unilabeltype_imageboard_img', $imagerecord);

            // Now we can save our draft files for image.
            file_save_draft_area_files($draftitemidimage, $context->id, 'unilabeltype_imageboard', 'image', $imagerecord->id);
        }
        $transaction->allow_commit();

        return !empty($unilabeltyperecord->id);
    }

    /**
     * Load and cache the unilabel record
     *
     * @param int $unilabelid
     * @return \stdClass
     */
    public function load_unilabeltype_record($unilabelid) {
        global $DB;

        if (empty($this->unilabeltyperecord)) {
            if (!$this->unilabeltyperecord = $DB->get_record('unilabeltype_imageboard', ['unilabelid' => $unilabelid])) {
                $this->images = [];
                return;
            }
            $this->cm = get_coursemodule_from_instance('unilabel', $unilabelid);
            $this->context = \context_module::instance($this->cm->id);

            $images = $DB->get_records('unilabeltype_imageboard_img', ['imageboardid' => $this->unilabeltyperecord->id]);

            $index = 1;
            foreach ($images as $image) {
                $image->imageurl = $this->get_imageurl_for_image($image);
                $image->nr = $index;
                $index++;
            }
            $this->images = $images;
            $this->unilabeltyperecord->backgroundimage = $this->get_backgroundimage();
        }
        return $this->unilabeltyperecord;
    }

    /**
     *  Get the backgroundimage url for this board.
     *
     * @return \moodle_url|string
     * @throws \coding_exception
     */
    private function get_backgroundimage() {
        $fs = get_file_storage();

        $files = $fs->get_area_files($this->context->id, 'unilabeltype_imageboard', 'backgroundimage', 0, '', $includedirs = false);
        if (!$file = array_shift($files)) {
            return '';
        }
        $imageurl = \moodle_url::make_pluginfile_url(
                $this->context->id,
                'unilabeltype_imageboard',
                'backgroundimage',
                0,
                '/',
                $file->get_filename()
        );
        return $imageurl;
    }

    /**
     * Get the image url for the given image
     *
     * @param \stdClass $image
     * @return string
     */
    private function get_imageurl_for_image($image) {
        $fs = get_file_storage();
        $files = $fs->get_area_files($this->context->id, 'unilabeltype_imageboard', 'image', $image->id, '', $includedirs = false);
        if (!$file = array_shift($files)) {
            return '';
        }
        $imageurl = \moodle_url::make_pluginfile_url(
                $this->context->id,
                'unilabeltype_imageboard',
                'image',
                $image->id,
                '/',
                $file->get_filename()
        );
        return $imageurl;
    }

    /**
     * Check whether ther is content or not.
     *
     * @param string $content
     * @return bool
     */
    private function html_has_content($content) {
        $searches = [
                '<br>',
                '<br />',
                '<p>',
                '</p>',
        ];

        $check = trim(str_replace($searches, '', $content));

        return !empty($check);
    }

    /**
     * Get the options array to support files in editor.
     *
     * @param \context $context
     * @return array
     */
    public function editor_options($context) {
        return [
                'maxfiles' => EDITOR_UNLIMITED_FILES,
                'noclean' => true,
                'context' => $context,
                'subdirs' => true,
        ];
    }

    /**
     * Get the format options array
     *
     * @param \context $context
     * @return array
     */
    public function format_options($context) {
        return [
                'noclean' => true,
                'context' => $context,
        ];
    }

    /**
     * Check that this plugin is activated on config settings.
     *
     * @return boolean
     */
    public function is_active() {
        return !empty($this->config->active);
    }

    /**
     * Get the data that should be rendered.
     *
     * @param $unilabel
     * @param $cm
     * @throws \coding_exception
     */
    public function get_data_to_render($unilabel, $cm, $ispreviewmode): array {
        global $PAGE, $USER;

        $unilabeltyperecord = $this->load_unilabeltype_record($unilabel->id);
        $cmid = 0;
        $intro = '';
        $showintro = false;
        $capababilityforgrid = false;
        // In previewmode $cm is null (do not yet know how to get $cm from the form).
        // So we need to check if we are in previewmode and set needed variables.
        if (!$ispreviewmode) {
            $cmid = $cm->id;
            $intro = $this->format_intro($unilabel, $cm);
            // Do not show intro in preview mode.
            $showintro = !empty($unilabeltyperecord->showintro);

            // Check if the user can edit the unilabel.
            // Then there should be a 50x50px grid visible that can be help for better positioning the images.
            $context = \context_module::instance($cm->id);
            $capababilityforgrid = has_capability('mod/unilabel:edit', $context, $USER->id, true);
        } else {
            $cmid = 0;
            $intro = '';
            $showintro = false;
            $capababilityforgrid = true;
        }
        $bordercolor = $this->config->default_bordercolor ?? '#ff0000';
        $gridcolor = $this->config->default_gridcolor ?? '#ff0000';

        $images = [];
        $hasimages = false;
        foreach ($this->images as $image) {
            $hasimages = true;
            if ($image->imageurl != '') {
                $image->imageurl = $image->imageurl->out();
            } else {
                $image->imageurl = '';
            }
            if (!empty($image->border)) {
                $image->border = $image->border;
            }
            $images[] = $image;
        }

        // Create a 50x50px helpergrid if $capababilityforgrid.
        $helpergrids = [];
        $canvaswidth = $unilabeltyperecord->canvaswidth;
        $canvasheight = $unilabeltyperecord->canvasheight;
        $autoscale = $unilabeltyperecord->autoscale;

        if ($capababilityforgrid) {
            for ($y = 0; $y < $canvasheight; $y = $y + 50) {
                for ($x = 0; $x < $canvaswidth; $x = $x + 50) {
                    $helpergrid = [];
                    $helpergrid['x'] = $x;
                    $helpergrid['y'] = $y;
                    $helpergrids[] = $helpergrid;
                }
            }
        }
        $dataToRender = [
                'ispreviewmode' => $ispreviewmode,
                'showintro' => $showintro,
                'intro' => $showintro ? $intro : '',
                'images' => $images,
                'hasimages' => $hasimages,
                'cmid' => $cmid,
                'canvaswidth' => $canvaswidth,
                'canvasheight' => $canvasheight,
                'autoscale' => $autoscale,
                'backgroundimage' => $unilabeltyperecord->backgroundimage,
            // 4. Add setting in function get_content.
                'fontsize' => $unilabeltyperecord->fontsize,
                'titlecolor' => $unilabeltyperecord->titlecolor,
                'titlebackgroundcolor' => $unilabeltyperecord->titlebackgroundcolor,
                'capababilityforgrid' => $capababilityforgrid,
                'bordercolor' => $bordercolor,
                'gridcolor' => $gridcolor,
                'helpergrids' => $helpergrids,
                'editing' => $PAGE->user_is_editing(),
        ];

        return $dataToRender;
    }

}