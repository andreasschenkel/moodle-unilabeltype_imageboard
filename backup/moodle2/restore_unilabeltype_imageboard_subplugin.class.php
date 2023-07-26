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
 * unilabel type imageboard
 *
 * @package     unilabeltype_imageboard
 * @author      Andreas Grabs <info@grabs-edv.de>
 * @author      Andreas Schenkel
 * @copyright   2018 onwards Grabs EDV {@link https://www.grabs-edv.de}
 * @license     http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

/**
 * Restore definition of this content type
 * @package     unilabeltype_imageboard
 * @author      Andreas Grabs <info@grabs-edv.de>
 * @author      Andreas Schenkel
 * @copyright   2018 onwards Grabs EDV {@link https://www.grabs-edv.de}
 * @license     http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
class restore_unilabeltype_imageboard_subplugin extends restore_subplugin {

    /**
     * Returns the paths to be handled by the subplugin at unilabel level
     * @return array
     */
    protected function define_unilabel_subplugin_structure() {

        $paths = array();

        $elename = $this->get_namefor();
        $elepath = $this->get_pathfor('/unilabeltype_imageboard');
        $paths[] = new restore_path_element($elename, $elepath);

        $elename = $this->get_namefor('tile');
        $elepath = $this->get_pathfor('/unilabeltype_imageboard/unilabeltype_imageboard_tile');
        $paths[] = new restore_path_element($elename, $elepath);

        return $paths; // And we return the interesting paths.
    }

    /**
     * Processes the element
     * @param array $data
     * @return void
     */
    public function process_unilabeltype_imageboard($data) {
        global $DB;

        $data = (object)$data;
        $oldid = $data->id;

        $data->unilabelid = $this->get_new_parentid('unilabel');

        $newitemid = $DB->insert_record('unilabeltype_imageboard', $data);
        $this->set_mapping($this->get_namefor(), $oldid, $newitemid, true);
        $this->add_related_files('unilabeltype_imageboard', 'backgroundimage', null);
    }

    /**
     * Processes the unilabeltype_imageboard_tile element
     * @param array $data
     */
    public function process_unilabeltype_imageboard_tile($data) {
        global $DB;

        $data = (object)$data;
        $oldid = $data->id;
        $data->imageboardid = $this->get_new_parentid($this->get_namefor());
        $newitemid = $DB->insert_record('unilabeltype_imageboard_tile', $data);
        $this->set_mapping($this->get_namefor('tile'), $oldid, $newitemid, true);

        // Process files.
        $this->add_related_files('unilabeltype_imageboard', 'image', 'unilabeltype_imageboard_tile');
    }

    /**
     * Define the contents in the unilabeltype that must be
     * processed by the link decoder
     */
    public static function define_decode_contents() {
        $contents = array();

        $contents[] = new restore_decode_content('unilabeltype_imageboard_tile',
            array('url'),
            'unilabeltype_imageboard_tile');

        return $contents;
    }

}
